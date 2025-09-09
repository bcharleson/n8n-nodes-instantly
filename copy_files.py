#!/usr/bin/env python3

import os
import shutil
import sys
from pathlib import Path

def copy_files():
    print("🚀 Copying n8n-nodes-instantly files to development environment...")
    
    # Define paths
    home_dir = Path.home()
    source_dir = Path("dist/src")
    custom_dir = home_dir / ".n8n-dev" / ".n8n" / "custom"
    
    # Create custom directory structure
    custom_dir.mkdir(parents=True, exist_ok=True)
    nodes_dir = custom_dir / "nodes"
    credentials_dir = custom_dir / "credentials"
    nodes_dir.mkdir(exist_ok=True)
    credentials_dir.mkdir(exist_ok=True)
    
    print(f"✅ Created directories in: {custom_dir}")
    
    # Copy credentials
    cred_source = source_dir / "credentials"
    if cred_source.exists():
        for file in cred_source.iterdir():
            if file.is_file():
                dest_file = credentials_dir / file.name
                shutil.copy2(file, dest_file)
                print(f"✅ Copied credential: {file.name}")
    
    # Copy nodes
    nodes_source = source_dir / "nodes"
    if nodes_source.exists():
        for item in nodes_source.iterdir():
            dest_item = nodes_dir / item.name
            if item.is_file():
                shutil.copy2(item, dest_item)
                print(f"✅ Copied node file: {item.name}")
            elif item.is_dir():
                if dest_item.exists():
                    shutil.rmtree(dest_item)
                shutil.copytree(item, dest_item)
                print(f"✅ Copied node directory: {item.name}")
    
    print("\n🎉 File copy complete!")
    print(f"📍 Files installed to: {custom_dir}")
    print("🔄 Please refresh your n8n browser tab to load the new node")
    print("🔍 Search for 'Instantly' in the node palette")
    
    # List what was copied
    print("\n📋 Copied files:")
    for root, dirs, files in os.walk(custom_dir):
        level = root.replace(str(custom_dir), '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f"{subindent}{file}")

if __name__ == "__main__":
    try:
        copy_files()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
