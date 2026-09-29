import os
import sys
import plistlib
import json

def sanitize_filename(filename):
    return filename.replace('/', '_').replace(':', '_').replace('?', '_')

def extract_webarchive(filepath, out_dir):
    with open(filepath, 'rb') as f:
        try:
            plist = plistlib.load(f)
        except Exception as e:
            print(f"Failed to parse {filepath}: {e}")
            return

    os.makedirs(out_dir, exist_ok=True)
    
    main_resource = plist.get('WebMainResource')
    subresources = plist.get('WebSubresources', [])
    
    manifest = {
        'main': None,
        'subresources': []
    }
    
    if main_resource:
        url = main_resource.get('WebResourceURL', 'unknown.html')
        data = main_resource.get('WebResourceData', b'')
        mime = main_resource.get('WebResourceMIMEType', '')
        
        filename = "main.html"
        with open(os.path.join(out_dir, filename), 'wb') as out_f:
            out_f.write(data)
        
        manifest['main'] = {'url': url, 'filename': filename, 'mime': mime}
        print(f"Extracted main resource: {filename}")
        
    for i, sub in enumerate(subresources):
        url = sub.get('WebResourceURL', '')
        data = sub.get('WebResourceData', b'')
        mime = sub.get('WebResourceMIMEType', '')
        
        if not data:
            continue
            
        # Extract filename from URL
        filename = url.split('/')[-1].split('?')[0]
        if not filename:
            filename = f"sub_{i}"
            if 'css' in mime: filename += '.css'
            elif 'javascript' in mime: filename += '.js'
            elif 'svg' in mime: filename += '.svg'
            elif 'png' in mime: filename += '.png'
            
        filename = sanitize_filename(filename)
        # Avoid collisions
        while os.path.exists(os.path.join(out_dir, filename)):
            filename = "_" + filename
            
        with open(os.path.join(out_dir, filename), 'wb') as out_f:
            out_f.write(data)
            
        manifest['subresources'].append({'url': url, 'filename': filename, 'mime': mime})
        
    with open(os.path.join(out_dir, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=2)
        
    print(f"Extracted {len(subresources)} subresources for {os.path.basename(filepath)}")

if __name__ == '__main__':
    src_dir = sys.argv[1] if len(sys.argv) > 1 else '/Users/ritesh/Documents/Cyfernode_alt/'
    out_base = os.path.join(src_dir, 'reference', 'extracted')
    
    for filename in os.listdir(src_dir):
        if filename.endswith('.webarchive'):
            filepath = os.path.join(src_dir, filename)
            # Make a clean directory name
            out_name = filename.replace('.webarchive', '')[:50].strip()
            out_dir = os.path.join(out_base, out_name)
            print(f"Extracting {filename} to {out_dir}")
            extract_webarchive(filepath, out_dir)
