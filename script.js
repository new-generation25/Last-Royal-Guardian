class PuzzleGame {
    constructor() {
        this.rows = 5;
        this.cols = 3;
        this.totalPieces = this.rows * this.cols;
        this.hintsLeft = 5;
        this.currentImage = null;
        this.puzzlePieces = [];
        this.gridCells = [];
        this.originalImageUsed = false; // 원본보기 사용 여부
        
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
        // 인트로 화면 3초 후 자동 시작
        setTimeout(() => {
            this.hideIntro();
            this.loadDefaultImage();
        }, 3000);

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
        
        // 원본 이미지 보기 (1회만 사용 가능)
        this.showImageBtn.addEventListener('click', () => {
            if (!this.originalImageUsed) {
                this.originalOverlay.classList.add('show');
                this.originalImageUsed = true;
                this.showImageBtn.disabled = true;
                this.showImageBtn.textContent = '원본 보기 (사용됨)';
            }
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
            
            if (piece) {
                // 기존 조각이 있으면 교체
                const existingPiece = cell.querySelector('.puzzle-piece');
                if (existingPiece) {
                    // 기존 조각을 드래그한 조각의 원래 위치로 이동
                    const originalParent = piece.parentElement;
                    if (originalParent && originalParent.classList.contains('grid-cell')) {
                        originalParent.appendChild(existingPiece);
                        originalParent.classList.add('occupied');
                        this.updatePieceStatus(existingPiece, originalParent);
                    } else {
                        this.movePieceToSlot(existingPiece);
                    }
                }
                
                this.placePieceInCell(piece, cell);
                this.checkCompletion();
            }
        });
    }

    movePieceToSlot(piece) {
        // 빈 슬롯 찾기
        const allSlots = [
            ...this.topSlots.querySelectorAll('.puzzle-slot'),
            ...this.leftSlots.querySelectorAll('.puzzle-slot'),
            ...this.rightSlots.querySelectorAll('.puzzle-slot'),
            ...this.bottomSlots.querySelectorAll('.puzzle-slot')
        ];
        
        const emptySlot = allSlots.find(slot => !slot.querySelector('.puzzle-piece'));
        if (emptySlot) {
            emptySlot.appendChild(piece);
        }
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
            
            // 드래그 이미지 설정 (마우스 위치에 맞춤)
            const rect = piece.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            // 드래그 이미지 생성
            const dragImage = piece.cloneNode(true);
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            dragImage.style.left = '-1000px';
            dragImage.style.width = '70px';
            dragImage.style.height = '70px';
            dragImage.style.opacity = '0.8';
            dragImage.style.pointerEvents = 'none';
            document.body.appendChild(dragImage);
            
            // 드래그 이미지 위치 설정 (실제 마우스 위치에 맞춤)
            e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
            
            // 임시 요소 제거 (dragend에서 제거)
            piece.dragImage = dragImage;
            
            piece.classList.add('dragging');
        });

        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
            
            // 드래그 이미지 제거
            if (piece.dragImage && document.body.contains(piece.dragImage)) {
                document.body.removeChild(piece.dragImage);
                piece.dragImage = null;
            }
        });
    }

    setupPieceTouchEvents(piece) {
        // 모바일 터치 이벤트만 활성화 (실제 터치 디바이스에서만)
        if (!('ontouchstart' in window) || window.innerWidth > 768) return;
        
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
            
            // 마지막 터치 좌표 가져오기
            const touch = e.changedTouches[0];
            const finalX = touch ? touch.clientX : currentX;
            const finalY = touch ? touch.clientY : currentY;
            
            // 드롭 영역 찾기
            const dropZone = this.findDropZone(finalX, finalY);
            
            if (dropZone && dropZone.classList.contains('grid-cell')) {
                // 기존 조각이 있으면 교체
                const existingPiece = dropZone.querySelector('.puzzle-piece');
                if (existingPiece) {
                    this.movePieceToSlot(existingPiece);
                }
                
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
        
        // 유효하지 않은 좌표 체크
        if (typeof x !== 'number' || typeof y !== 'number' || 
            isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
            return;
        }
        
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
        // 유효하지 않은 좌표 체크
        if (typeof x !== 'number' || typeof y !== 'number' || 
            isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
            return null;
        }
        
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
        this.updatePieceStatus(piece, cell);
    }

    updatePieceStatus(piece, cell) {
        // 올바른 위치인지 확인
        const pieceId = parseInt(piece.dataset.correctId);
        const cellId = parseInt(cell.dataset.correctId);
        
        if (pieceId === cellId) {
            // 올바른 위치 - 초록색 테두리
            piece.classList.remove('incorrect');
            piece.classList.add('correct');
        } else {
            // 틀린 위치 - 흰색 테두리
            piece.classList.remove('correct');
            piece.classList.add('incorrect');
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

    showHint() {
        if (this.hintsLeft <= 0) return;
        
        // 슬롯에 있는 퍼즐 조각들 중 하나를 랜덤 선택
        const slotPieces = this.puzzlePieces.filter(piece => 
            piece.parentElement && piece.parentElement.classList.contains('puzzle-slot')
        );
        
        if (slotPieces.length > 0) {
            // 랜덤으로 하나 선택
            const randomPiece = slotPieces[Math.floor(Math.random() * slotPieces.length)];
            const correctId = parseInt(randomPiece.dataset.correctId);
            
            // 올바른 위치의 셀 찾기
            const correctCell = this.gridCells.find(cell => 
                parseInt(cell.dataset.correctId) === correctId
            );
            
            if (correctCell && !correctCell.querySelector('.puzzle-piece')) {
                // 조각을 올바른 위치로 이동
                correctCell.appendChild(randomPiece);
                correctCell.classList.add('occupied');
                randomPiece.classList.remove('incorrect');
                randomPiece.classList.add('correct');
                
                // 힌트 효과
                randomPiece.classList.add('hint-highlight');
                setTimeout(() => {
                    randomPiece.classList.remove('hint-highlight');
                }, 2000);
                
                this.checkCompletion();
            }
        }
        
        this.hintsLeft--;
        this.hintCount.textContent = this.hintsLeft;
        
        if (this.hintsLeft === 0) {
            this.hintBtn.disabled = true;
            this.hintBtn.textContent = '힌트 (0)';
        }
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
            alert('축하합니다! 가야 기마인물형 토기 퍼즐을 완성하셨습니다! 🎉');
            this.puzzleGrid.classList.remove('puzzle-complete');
        }, 2400);
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});