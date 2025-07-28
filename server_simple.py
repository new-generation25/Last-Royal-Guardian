#!/usr/bin/env python3
"""
간단한 웹 서버 - 다른 포트로 실행
"""

import http.server
import socketserver
import socket
import os
from pathlib import Path

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def main():
    PORT = 8080  # 다른 포트 사용
    LOCAL_IP = get_local_ip()
    
    os.chdir(Path(__file__).parent)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print("🎮 퍼즐 게임 웹 서버 (포트 8080)")
        print("=" * 50)
        print(f"📱 폰에서 접속:")
        print(f"   http://{LOCAL_IP}:{PORT}")
        print()
        print(f"💻 컴퓨터에서 접속:")
        print(f"   http://localhost:{PORT}")
        print()
        print("🛑 종료: Ctrl+C")
        print("=" * 50)
        
        httpd.serve_forever()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 서버 종료")
    except Exception as e:
        print(f"\n❌ 오류: {e}") 