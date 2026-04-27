#!/usr/bin/env python3
"""
Helper script to verify student-list.txt format
Run this in the flask-backend directory to check if the file is properly formatted
"""

import os

def verify_student_list(filename='student-list.txt'):
    """Verify student list file format"""
    
    if not os.path.exists(filename):
        print(f"❌ ERROR: {filename} not found!")
        print(f"\n📝 Please copy the file:")
        print(f"   cp ../src/imports/student-list.txt ./{filename}")
        return False
    
    print(f"✅ Found {filename}")
    
    with open(filename, 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]
    
    if len(lines) == 0:
        print("❌ ERROR: File is empty!")
        return False
    
    # Check format (should be email, password, email, password...)
    email_count = 0
    password_count = 0
    
    for i, line in enumerate(lines, 1):
        if '@mbcet.ac.in' in line:
            email_count += 1
        elif '_EE' in line or any(c.isupper() for c in line):
            password_count += 1
    
    print(f"\n📊 Statistics:")
    print(f"   Total lines: {len(lines)}")
    print(f"   Emails found: {email_count}")
    print(f"   Passwords found: {password_count}")
    
    if email_count > 0 and password_count > 0:
        print(f"\n✅ File format looks good!")
        print(f"   Approximately {email_count} students will be created")
        return True
    else:
        print(f"\n❌ ERROR: File format seems incorrect")
        print(f"   Expected format:")
        print(f"   email@mbcet.ac.in")
        print(f"   Password123_EE")
        print(f"   email2@mbcet.ac.in")
        print(f"   Password456_EE")
        return False

def show_sample_students(filename='student-list.txt', count=5):
    """Show first few students from the file"""
    
    if not os.path.exists(filename):
        return
    
    print(f"\n📋 First {count} students:")
    print("-" * 60)
    
    with open(filename, 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]
    
    i = 0
    shown = 0
    while i < len(lines) and shown < count:
        if i + 1 < len(lines):
            email = lines[i]
            password = lines[i + 1]
            
            if '@mbcet.ac.in' in email:
                print(f"   Email: {email}")
                print(f"   Password: {password}")
                print()
                shown += 1
            
            i += 2
        else:
            break

if __name__ == '__main__':
    print("=" * 60)
    print("🔍 Student List Verification Tool")
    print("=" * 60)
    print()
    
    if verify_student_list():
        show_sample_students()
        print("\n" + "=" * 60)
        print("✅ Ready to initialize database!")
        print("   Run: python app.py")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ Please fix the issues above before running the app")
        print("=" * 60)
