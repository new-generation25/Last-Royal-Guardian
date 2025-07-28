class PuzzleGame {
    constructor() {
        this.rows = 5;
        this.cols = 3;
        this.totalPieces = this.rows * this.cols;
        this.hintsLeft = 5;
        this.currentImage = null;
        this.puzzlePieces = [];
        this.gridCells = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.createPuzzleGrid();
        this.showIntro();
    }

    initializeElements() {
        // UI 요소들
        this.gameIntro = document.getElementById('gameIntro');
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.showImageBtn = document.getElementById('showImageBtn');
        this.hintCount = document.getElementById('hintCount');
        this.puzzleGrid = document.getElementById('puzzleGrid');
        this.originalOverlay = document.getElementById('originalOverlay');
        this.originalImage = document.getElementById('originalImage');
        
        // 퍼즐 슬롯 영역들
        this.topSlots = document.getElementById('topSlots');
        this.leftSlots = document.getElementById('leftSlots');
        this.rightSlots = document.getElementById('rightSlots');
        this.bottomSlots = document.getElementById('bottomSlots');
    }

    setupEventListeners() {
        // 인트로 화면 클릭으로 게임 시작
        this.gameIntro.addEventListener('click', () => {
            this.hideIntro();
            this.loadDefaultImage();
        });

        // 파일 업로드
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.loadImageFromFile(e.target.files[0]);
            }
        });

        // 게임 버튼들
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.shuffleBtn.addEventListener('click', () => this.shufflePieces());
        
        // 원본 이미지 보기
        this.showImageBtn.addEventListener('click', () => {
            this.originalOverlay.classList.add('show');
        });

        this.originalOverlay.addEventListener('click', () => {
            this.originalOverlay.classList.remove('show');
        });
    }

    showIntro() {
        this.gameIntro.style.display = 'flex';
    }

    hideIntro() {
        this.gameIntro.style.display = 'none';
    }

    createPuzzleGrid() {
        this.puzzleGrid.innerHTML = '';
        this.gridCells = [];

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.correctId = row * this.cols + col;
                
                this.setupDropZone(cell);
                this.puzzleGrid.appendChild(cell);
                this.gridCells.push(cell);
            }
        }
    }

    setupDropZone(cell) {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('drag-over');
        });

        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            
            const pieceId = e.dataTransfer.getData('text/plain');
            const piece = document.getElementById(pieceId);
            
            if (piece && !cell.querySelector('.puzzle-piece')) {
                this.placePieceInCell(piece, cell);
                this.checkCompletion();
            }
        });
    }

    loadDefaultImage() {
        this.currentImage = 'gima2.png';
        this.originalImage.src = this.currentImage;
        this.createPuzzlePieces();
    }

    loadImageFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.originalImage.src = this.currentImage;
            this.createPuzzlePieces();
        };
        reader.readAsDataURL(file);
    }

    createPuzzlePieces() {
        // 기존 퍼즐 조각들 제거
        this.puzzlePieces.forEach(piece => piece.remove());
        this.puzzlePieces = [];

        // 슬롯 영역들 초기화
        this.clearSlots();

        // 새 퍼즐 조각들 생성
        for (let i = 0; i < this.totalPieces; i++) {
            const piece = this.createPuzzlePiece(i);
            this.puzzlePieces.push(piece);
        }

        // 조각들을 슬롯에 배치
        this.distributePieces();
    }

    createPuzzlePiece(id) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece-${id}`;
        piece.dataset.correctId = id;
        
        const row = Math.floor(id / this.cols);
        const col = id % this.cols;
        
        // 배경 이미지 위치 계산 (70px 단위)
        const bgX = -(col * 70);
        const bgY = -(row * 70);
        
        piece.style.backgroundImage = `url(${this.currentImage})`;
        piece.style.backgroundPosition = `${bgX}px ${bgY}px`;
        piece.style.backgroundSize = '210px 350px';
        
        this.setupPieceDragEvents(piece);
        this.setupPieceTouchEvents(piece);
        
        return piece;
    }

    setupPieceDragEvents(piece) {
        piece.draggable = true;
        
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.id);
            piece.classList.add('dragging');
        });

        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
        });
    }

    setupPieceTouchEvents(piece) {
        // 모바일 터치 이벤트만 활성화
        if (!('ontouchstart' in window)) return;
        
        let startX, startY, currentX, currentY;
        let initialLeft, initialTop;
        let isDragging = false;
        let originalParent, originalNextSibling;

        piece.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            // 원래 위치 저장
            originalParent = piece.parentElement;
            originalNextSibling = piece.nextSibling;
            
            // 드래그 시작
            isDragging = true;
            piece.classList.add('dragging');
            
            // body에 추가하여 자유 이동
            document.body.appendChild(piece);
            piece.style.position = 'fixed';
            piece.style.zIndex = '1000';
            piece.style.pointerEvents = 'none';
            
            // 초기 위치 설정
            const rect = piece.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            piece.style.left = `${initialLeft}px`;
            piece.style.top = `${initialTop}px`;
        });

        piece.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
            
            // 터치 시작점에서의 이동량 계산
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // 새 위치 설정
            piece.style.left = `${initialLeft + deltaX}px`;
            piece.style.top = `${initialTop + deltaY}px`;
            
            // 드롭 영역 하이라이트
            this.highlightDropZone(currentX, currentY);
        });

        piece.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            isDragging = false;
            piece.classList.remove('dragging');
            
            // 드롭 영역 찾기
            const dropZone = this.findDropZone(currentX, currentY);
            
            if (dropZone && dropZone.classList.contains('grid-cell') && 
                !dropZone.querySelector('.puzzle-piece')) {
                // 그리드 셀에 배치
                this.placePieceInCell(piece, dropZone);
                this.checkCompletion();
            } else if (dropZone && dropZone.classList.contains('puzzle-slot') && 
                      !dropZone.querySelector('.puzzle-piece')) {
                // 슬롯에 배치
                dropZone.appendChild(piece);
            } else {
                // 원래 위치로 복원
                if (originalParent) {
                    if (originalNextSibling) {
                        originalParent.insertBefore(piece, originalNextSibling);
                    } else {
                        originalParent.appendChild(piece);
                    }
                }
            }
            
            // 스타일 초기화
            piece.style.position = '';
            piece.style.zIndex = '';
            piece.style.left = '';
            piece.style.top = '';
            piece.style.pointerEvents = '';
            
            // 하이라이트 제거
            this.removeDropZoneHighlights();
        });
    }

    highlightDropZone(x, y) {
        this.removeDropZoneHighlights();
        
        const element = document.elementFromPoint(x, y);
        if (element && (element.classList.contains('grid-cell') || 
                       element.classList.contains('puzzle-slot'))) {
            element.classList.add('drag-over');
        }
    }

    removeDropZoneHighlights() {
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    findDropZone(x, y) {
        const element = document.elementFromPoint(x, y);
        if (element && (element.classList.contains('grid-cell') || 
                       element.classList.contains('puzzle-slot'))) {
            return element;
        }
        return null;
    }

    placePieceInCell(piece, cell) {
        cell.appendChild(piece);
        cell.classList.add('occupied');
        
        // 올바른 위치인지 확인
        const pieceId = parseInt(piece.dataset.correctId);
        const cellId = parseInt(cell.dataset.correctId);
        
        if (pieceId === cellId) {
            // 올바른 위치
            piece.style.border = '4px inset #28a745';
            piece.style.boxShadow = 'inset 0 2px 8px rgba(40, 167, 69, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    }

    clearSlots() {
        [this.topSlots, this.leftSlots, this.rightSlots, this.bottomSlots].forEach(slot => {
            slot.innerHTML = '';
        });
    }

    distributePieces() {
        // 각 영역별 슬롯 개수
        const topCount = 3;
        const sideCount = 5;
        const bottomCount = 2;
        
        // 조각들을 섞기
        const shuffledPieces = [...this.puzzlePieces].sort(() => Math.random() - 0.5);
        
        let pieceIndex = 0;
        
        // 상단 영역에 배치
        for (let i = 0; i < topCount && pieceIndex < shuffledPieces.length; i++) {
            const slot = this.createSlot();
            slot.appendChild(shuffledPieces[pieceIndex++]);
            this.topSlots.appendChild(slot);
        }
        
        // 좌측 영역에 배치
        for (let i = 0; i < sideCount && pieceIndex < shuffledPieces.length; i++) {
            const slot = this.createSlot();
            slot.appendChild(shuffledPieces[pieceIndex++]);
            this.leftSlots.appendChild(slot);
        }
        
        // 우측 영역에 배치
        for (let i = 0; i < sideCount && pieceIndex < shuffledPieces.length; i++) {
            const slot = this.createSlot();
            slot.appendChild(shuffledPieces[pieceIndex++]);
            this.rightSlots.appendChild(slot);
        }
        
        // 하단 영역에 배치
        for (let i = 0; i < bottomCount && pieceIndex < shuffledPieces.length; i++) {
            const slot = this.createSlot();
            slot.appendChild(shuffledPieces[pieceIndex++]);
            this.bottomSlots.appendChild(slot);
        }
    }

    createSlot() {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        this.setupSlotDropZone(slot);
        return slot;
    }

    setupSlotDropZone(slot) {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.querySelector('.puzzle-piece')) {
                slot.classList.add('drag-over');
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            if (!slot.querySelector('.puzzle-piece')) {
                const pieceId = e.dataTransfer.getData('text/plain');
                const piece = document.getElementById(pieceId);
                if (piece) {
                    slot.appendChild(piece);
                }
            }
        });
    }

    shufflePieces() {
        // 모든 조각들을 수집
        const allPieces = this.puzzlePieces.filter(piece => 
            !piece.parentElement.classList.contains('grid-cell')
        );
        
        // 조각들을 슬롯에서 제거
        allPieces.forEach(piece => {
            if (piece.parentElement.classList.contains('puzzle-slot')) {
                piece.remove();
            }
        });
        
        // 다시 배치
        this.distributePieces();
    }

    showHint() {
        if (this.hintsLeft <= 0) return;
        
        // 잘못 배치된 조각 찾기
        const wrongPieces = [];
        this.gridCells.forEach(cell => {
            const piece = cell.querySelector('.puzzle-piece');
            if (piece) {
                const pieceId = parseInt(piece.dataset.correctId);
                const cellId = parseInt(cell.dataset.correctId);
                if (pieceId !== cellId) {
                    wrongPieces.push(piece);
                }
            }
        });
        
        // 빈 올바른 위치 찾기
        const emptyCorrectCells = this.gridCells.filter(cell => 
            !cell.querySelector('.puzzle-piece')
        );
        
        if (wrongPieces.length > 0) {
            // 잘못된 조각 하이라이트
            const randomWrong = wrongPieces[Math.floor(Math.random() * wrongPieces.length)];
            this.highlightPiece(randomWrong);
        } else if (emptyCorrectCells.length > 0) {
            // 빈 올바른 위치 하이라이트
            const randomEmpty = emptyCorrectCells[Math.floor(Math.random() * emptyCorrectCells.length)];
            this.highlightCell(randomEmpty);
        }
        
        this.hintsLeft--;
        this.hintCount.textContent = this.hintsLeft;
        
        if (this.hintsLeft === 0) {
            this.hintBtn.disabled = true;
        }
    }

    highlightPiece(piece) {
        piece.classList.add('hint-highlight');
        setTimeout(() => {
            piece.classList.remove('hint-highlight');
        }, 2000);
    }

    highlightCell(cell) {
        cell.classList.add('hint-highlight');
        setTimeout(() => {
            cell.classList.remove('hint-highlight');
        }, 2000);
    }

    checkCompletion() {
        let correctPieces = 0;
        
        this.gridCells.forEach(cell => {
            const piece = cell.querySelector('.puzzle-piece');
            if (piece) {
                const pieceId = parseInt(piece.dataset.correctId);
                const cellId = parseInt(cell.dataset.correctId);
                if (pieceId === cellId) {
                    correctPieces++;
                }
            }
        });
        
        if (correctPieces === this.totalPieces) {
            this.showCompletionEffect();
        }
    }

    showCompletionEffect() {
        // 완성 애니메이션
        this.puzzleGrid.classList.add('puzzle-complete');
        
        // 축하 메시지
        setTimeout(() => {
            alert('축하합니다! 가야 기마인물형 토기 퍼즐을 완성하셨습니다!');
            this.puzzleGrid.classList.remove('puzzle-complete');
        }, 2400);
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});