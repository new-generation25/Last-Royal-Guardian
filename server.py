#!/usr/bin/env python3
"""
간단한 웹 서버 - 퍼즐 게임을 폰에서 실행할 수 있게 해줍니다.
"""

import http.server
import socketserver
import socket
import webbrowser
import os
from pathlib import Path

def get_local_ip():
    """로컬 IP 주소를 가져옵니다."""
    try:
        # 로컬 IP 주소 가져오기
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def main():
    # 현재 디렉토리에서 서버 실행
    PORT = 8000
    LOCAL_IP = get_local_ip()
    
    # 현재 디렉토리를 웹 루트로 설정
    os.chdir(Path(__file__).parent)
    
    # HTTP 서버 생성
    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        '.js': 'application/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    })
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print("🎮 퍼즐 게임 웹 서버가 시작되었습니다!")
        print("=" * 50)
        print(f"📱 폰에서 접속할 주소:")
        print(f"   http://{LOCAL_IP}:{PORT}")
        print()
        print(f"💻 컴퓨터에서 접속할 주소:")
        print(f"   http://localhost:{PORT}")
        print()
        print("⚠️  주의사항:")
        print("   - 폰과 컴퓨터가 같은 WiFi에 연결되어 있어야 합니다")
        print("   - 방화벽에서 8000번 포트를 허용해야 할 수 있습니다")
        print()
        print("🛑 서버를 종료하려면 Ctrl+C를 누르세요")
        print("=" * 50)
        
        # 브라우저에서 자동으로 열기
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except:
            pass
        
        # 서버 실행
        httpd.serve_forever()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 서버가 종료되었습니다.")
    except Exception as e:
        print(f"\n❌ 오류가 발생했습니다: {e}") 