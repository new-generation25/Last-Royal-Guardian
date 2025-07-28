class PuzzleGame {
    constructor() {
        this.rows = 5;
        this.cols = 3;
        this.totalPieces = this.rows * this.cols;
        this.hintsLeft = 5;
        this.currentImage = null;
        this.puzzlePieces = [];
        this.gridCells = [];
        this.originalImageData = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.createPuzzleGrid();
        
        // 기본 이미지 자동 로드
        this.loadDefaultImage();
        
        // 윈도우 리사이즈 시 퍼즐 조각 크기만 조정 (재생성하지 않음)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (this.currentImage) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resizePuzzlePieces();
                }, 200);
            }
        });
    }

    initializeElements() {
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.hintCount = document.getElementById('hintCount');
        this.puzzleGrid = document.getElementById('puzzleGrid');
        this.originalOverlay = document.getElementById('originalOverlay');
        this.originalImage = document.getElementById('originalImage');
        
        // 퍼즐 슬롯 영역들
        this.topSlots = document.getElementById('topSlots');
        this.leftSlots = document.getElementById('leftSlots');
        this.rightSlots = document.getElementById('rightSlots');
        this.bottomSlots = document.getElementById('bottomSlots');
        
        // 인트로 요소들
        this.gameIntro = document.getElementById('gameIntro');
        this.introImage = document.getElementById('introImage');
        
        // 오디오 생성
        this.createAudioElements();
    }

    createAudioElements() {
        // 퍼즐 맞을 때 효과음 (딸깍)
        this.clickSound = new Audio();
        this.clickSound.src = 'data:audio/wav;base64,UklGRnABAABXQVZFZm10IBAAAAABAAEAIlYAAIhYAQACABAAZGF0YUwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
        
        // 완성 효과음 (쓔욱)
        this.completeSound = new Audio();
        this.completeSound.src = 'data:audio/wav;base64,UklGRiQBAABXQVZFZm10IBAAAAABAAEAIlYAAIhYAQACABAAZGF0YQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    }

    setupEventListeners() {
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        this.hintBtn.addEventListener('click', () => {
            this.showHint();
        });

        this.shuffleBtn.addEventListener('click', () => {
            this.shufflePieces();
        });
    }

    loadDefaultImage() {
        // 기본 이미지 로드 - 더 안정적인 방법
        console.log('기본 이미지 로드 시작...');
        
        // 먼저 빈 퍼즐 그리드 생성
        this.createEmptyPuzzleGrid();
        
        const defaultImage = new Image();
        defaultImage.crossOrigin = 'anonymous';
        
        defaultImage.onload = () => {
            console.log('기본 이미지 로드 성공:', defaultImage.width, 'x', defaultImage.height);
            this.currentImage = 'gima2.png';
            this.originalImageData = defaultImage;
            this.originalImage.src = this.currentImage;
            this.introImage.src = this.currentImage;
            
            // 3초 후 퍼즐 조각 생성
            setTimeout(() => {
                this.createPuzzlePieces();
                this.showGameIntro();
            }, 1000);
        };
        
        defaultImage.onerror = (error) => {
            console.error('기본 이미지 로드 실패:', error);
            // 기본 이미지 로드 실패 시에도 게임 진행 가능하도록
            this.currentImage = null;
            this.showGameIntro();
        };
        
        // 이미지 로드 시작
        defaultImage.src = 'gima2.png';
    }

    createEmptyPuzzleGrid() {
        // 빈 퍼즐 그리드 생성 (이미지 없이)
        console.log('빈 퍼즐 그리드 생성');
        this.puzzleGrid.style.border = '2px dashed #ccc';
        this.puzzleGrid.style.backgroundColor = '#f9f9f9';
        
        // 격자 셀에 안내 텍스트 추가
        this.gridCells.forEach((cell, index) => {
            cell.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 10px;">${index + 1}</div>`;
        });
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
                cell.dataset.position = row * this.cols + col;
                
                this.setupDropZone(cell);
                this.puzzleGrid.appendChild(cell);
                this.gridCells.push(cell);
            }
        }
    }

    setupDropZone(cell) {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('drop-zone');
        });

        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drop-zone');
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drop-zone');
            
            const pieceId = e.dataTransfer.getData('text/plain');
            const piece = document.getElementById(pieceId);
            
            if (piece && !cell.hasChildNodes()) {
                this.placePiece(piece, cell);
            }
        });
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.currentImage = event.target.result;
            this.originalImage.src = this.currentImage;
            this.introImage.src = this.currentImage;
            this.showGameIntro();
        };
        reader.readAsDataURL(file);
    }

    showGameIntro() {
        // 이미지가 있으면 인트로 표시, 없으면 바로 게임 시작
        if (this.currentImage) {
            this.gameIntro.classList.add('show');
            
            setTimeout(() => {
                this.gameIntro.classList.remove('show');
                this.createPuzzlePieces();
                this.resetHints();
            }, 3000);
        } else {
            // 이미지가 없으면 바로 게임 시작
            console.log('이미지 없이 게임 시작');
            this.createPuzzlePieces();
            this.resetHints();
        }
    }

    createPuzzlePieces() {
        console.log('퍼즐 조각 생성 시작...');
        this.clearAllSlots();
        this.puzzlePieces = [];

        if (!this.currentImage) {
            console.log('이미지가 없어서 색상 퍼즐 조각을 생성합니다.');
            this.createColorPuzzlePieces();
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            console.log('이미지 로드 완료, 퍼즐 조각 생성 중...', img.width, 'x', img.height);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            this.originalImageData = canvas;
            
            // 퍼즐 조각 생성
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const piece = this.createPuzzlePiece(row, col, img);
                    this.puzzlePieces.push(piece);
                }
            }
            
            console.log('퍼즐 조각 생성 완료:', this.puzzlePieces.length, '개');
            this.distributePieces();
        };
        
        img.onerror = (error) => {
            console.error('퍼즐 조각 생성 중 이미지 로드 실패:', error);
            this.createColorPuzzlePieces();
        };
        
        img.src = this.currentImage;
    }

    createColorPuzzlePieces() {
        // 색상 퍼즐 조각 생성 (이미지가 없을 때)
        console.log('색상 퍼즐 조각 생성 중...');
        
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.id = `piece-${row}-${col}`;
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.position = row * this.cols + col;
                piece.draggable = true;
                
                const index = row * this.cols + col;
                piece.style.backgroundColor = colors[index];
                piece.style.border = '2px solid #333';
                piece.style.display = 'flex';
                piece.style.alignItems = 'center';
                piece.style.justifyContent = 'center';
                piece.style.color = '#fff';
                piece.style.fontWeight = 'bold';
                piece.style.fontSize = '12px';
                piece.textContent = `${index + 1}`;
                
                this.setupDragAndDrop(piece);
                this.setupTouchEvents(piece);
                this.puzzlePieces.push(piece);
            }
        }
        
        console.log('색상 퍼즐 조각 생성 완료:', this.puzzlePieces.length, '개');
        this.distributePieces();
    }

    createPuzzlePiece(row, col, img) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece-${row}-${col}`;
        piece.dataset.row = row;
        piece.dataset.col = col;
        piece.dataset.position = row * this.cols + col;
        piece.draggable = true;

        // 반응형 퍼즐 조각 크기 (뷰포트 기준)
        const pieceSize = Math.min(window.innerWidth * 0.08, window.innerHeight * 0.08, 80);
        const totalWidth = pieceSize * this.cols;
        const totalHeight = pieceSize * this.rows;

        // 이미지를 퍼즐 전체 크기에 맞게 스케일링
        const imageAspect = img.width / img.height;
        const puzzleAspect = totalWidth / totalHeight;
        let scaledWidth, scaledHeight;
        if (imageAspect > puzzleAspect) {
            scaledHeight = totalHeight;
            scaledWidth = scaledHeight * imageAspect;
        } else {
            scaledWidth = totalWidth;
            scaledHeight = scaledWidth / imageAspect;
        }
        const backgroundX = -col * (scaledWidth / this.cols);
        const backgroundY = -row * (scaledHeight / this.rows);
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url(${this.currentImage})`;
        piece.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        this.setupDragAndDrop(piece);
        this.setupTouchEvents(piece);
        return piece;
    }

    setupDragAndDrop(piece) {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.id);
            piece.classList.add('dragging');
        });

        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
        });
    }

    setupTouchEvents(piece) {
        let startX, startY, currentX, currentY;
        let isDragging = false;
        let originalParent, originalNextSibling;

        piece.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = startX;
            currentY = startY;
            
            // 원래 위치 저장
            originalParent = piece.parentElement;
            originalNextSibling = piece.nextSibling;
            
            // 드래그 시작
            isDragging = true;
            piece.classList.add('dragging');
            
            // 퍼즐 조각을 body에 추가하여 자유롭게 이동
            document.body.appendChild(piece);
            piece.style.position = 'fixed';
            piece.style.zIndex = '1000';
            piece.style.pointerEvents = 'none';
            
            // 초기 위치 설정
            const rect = piece.getBoundingClientRect();
            piece.style.left = `${rect.left}px`;
            piece.style.top = `${rect.top}px`;
        });

        piece.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
            
            // 퍼즐 조각 이동
            piece.style.left = `${currentX - startX + parseInt(piece.style.left || 0)}px`;
            piece.style.top = `${currentY - startY + parseInt(piece.style.top || 0)}px`;
            
            // 드롭 영역 하이라이트
            this.highlightDropZones(currentX, currentY);
        });

        piece.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            isDragging = false;
            piece.classList.remove('dragging');
            
            // 드롭 영역 하이라이트 제거
            this.removeDropZoneHighlights();
            
            // 드롭 가능한 영역 찾기
            const dropZone = this.findDropZone(currentX, currentY);
            
            if (dropZone) {
                // 드롭 영역에 배치
                this.placePieceInZone(piece, dropZone);
            } else {
                // 원래 위치로 복원
                this.restorePiece(piece, originalParent, originalNextSibling);
            }
            
            // 스타일 초기화
            piece.style.position = '';
            piece.style.zIndex = '';
            piece.style.left = '';
            piece.style.top = '';
            piece.style.pointerEvents = '';
        });
    }

    highlightDropZones(x, y) {
        // 모든 드롭 영역에서 하이라이트 제거
        this.removeDropZoneHighlights();
        
        // 마우스 위치의 드롭 영역 하이라이트
        const element = document.elementFromPoint(x, y);
        if (element && (element.classList.contains('grid-cell') || element.classList.contains('puzzle-slot'))) {
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
        if (element && element.classList.contains('grid-cell') && !element.hasChildNodes()) {
            return element;
        }
        if (element && element.classList.contains('puzzle-slot') && !element.hasChildNodes()) {
            return element;
        }
        return null;
    }

    placePieceInZone(piece, zone) {
        if (zone.classList.contains('grid-cell')) {
            this.placePiece(piece, zone);
        } else if (zone.classList.contains('puzzle-slot')) {
            zone.appendChild(piece);
        }
    }

    restorePiece(piece, parent, nextSibling) {
        if (parent) {
            if (nextSibling) {
                parent.insertBefore(piece, nextSibling);
            } else {
                parent.appendChild(piece);
            }
        }
    }

    distributePieces() {
        console.log('퍼즐 조각 분배 시작...');
        
        // 퍼즐 조각들을 섞기
        const shuffledPieces = [...this.puzzlePieces].sort(() => Math.random() - 0.5);
        
        // 기존 슬롯들 모두 제거
        this.clearAllSlots();
        
        // 상단 영역에 3개
        const topPieces = shuffledPieces.slice(0, 3);
        console.log('상단 영역에 배치:', topPieces.length, '개');
        topPieces.forEach(piece => {
            const slot = this.createPuzzleSlot();
            slot.appendChild(piece);
            this.topSlots.appendChild(slot);
        });

        // 좌측 영역에 5개
        const leftPieces = shuffledPieces.slice(3, 8);
        console.log('좌측 영역에 배치:', leftPieces.length, '개');
        leftPieces.forEach(piece => {
            const slot = this.createPuzzleSlot();
            slot.appendChild(piece);
            this.leftSlots.appendChild(slot);
        });

        // 우측 영역에 5개
        const rightPieces = shuffledPieces.slice(8, 13);
        console.log('우측 영역에 배치:', rightPieces.length, '개');
        rightPieces.forEach(piece => {
            const slot = this.createPuzzleSlot();
            slot.appendChild(piece);
            this.rightSlots.appendChild(slot);
        });

        // 하단 영역에 2개
        const bottomPieces = shuffledPieces.slice(13);
        console.log('하단 영역에 배치:', bottomPieces.length, '개');
        bottomPieces.forEach(piece => {
            const slot = this.createPuzzleSlot();
            slot.appendChild(piece);
            this.bottomSlots.appendChild(slot);
        });
        
        // 모든 영역 강제 표시
        this.topSlots.style.display = 'flex';
        this.topSlots.style.visibility = 'visible';
        this.leftSlots.style.display = 'flex';
        this.leftSlots.style.visibility = 'visible';
        this.rightSlots.style.display = 'flex';
        this.rightSlots.style.visibility = 'visible';
        this.bottomSlots.style.display = 'flex';
        this.bottomSlots.style.visibility = 'visible';
        
        console.log('퍼즐 조각 분배 완료');
        console.log('상단 슬롯:', this.topSlots.children.length, '개');
        console.log('좌측 슬롯:', this.leftSlots.children.length, '개');
        console.log('우측 슬롯:', this.rightSlots.children.length, '개');
        console.log('하단 슬롯:', this.bottomSlots.children.length, '개');
    }

    createPuzzleSlot() {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        
        // 슬롯에서도 드래그 앤 드롭 가능하도록
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.hasChildNodes()) {
                slot.classList.add('drag-over');
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            if (!slot.hasChildNodes()) {
                const pieceId = e.dataTransfer.getData('text/plain');
                const piece = document.getElementById(pieceId);
                if (piece) {
                    slot.appendChild(piece);
                }
            }
        });

        return slot;
    }

    placePiece(piece, cell) {
        const piecePosition = parseInt(piece.dataset.position);
        const cellPosition = parseInt(cell.dataset.position);
        
        cell.appendChild(piece);
        cell.classList.add('occupied');
        
        // 올바른 위치에 놓였는지 확인
        if (piecePosition === cellPosition) {
            piece.style.border = '1px solid #28a745';
            
            // 딸깍 효과음 재생
            try {
                this.clickSound.currentTime = 0;
                this.clickSound.play().catch(e => console.log('오디오 재생 실패:', e));
            } catch (e) {
                console.log('오디오 재생 실패:', e);
            }
            
            this.checkCompletion();
        } else {
            piece.style.border = '1px solid #fff';
        }
    }

    showHint() {
        if (this.hintsLeft <= 0 || !this.currentImage) return;

        this.hintsLeft--;
        this.hintCount.textContent = this.hintsLeft;
        
        // 아직 맞춰지지 않은 퍼즐 조각들 찾기
        const wrongPieces = [];
        
        // 모든 퍼즐 조각을 검사하여 잘못된 위치에 있는 것들 찾기
        this.puzzlePieces.forEach(piece => {
            const piecePosition = parseInt(piece.dataset.position);
            const currentParent = piece.parentElement;
            
            // 격자에 있는 조각 중 잘못된 위치에 있는 것
            if (currentParent && currentParent.classList.contains('grid-cell')) {
                const cellPosition = parseInt(currentParent.dataset.position);
                if (piecePosition !== cellPosition) {
                    wrongPieces.push(piece);
                }
            }
            // 격자 밖에 있는 조각들
            else if (currentParent && currentParent.classList.contains('puzzle-slot')) {
                wrongPieces.push(piece);
            }
        });
        
        if (wrongPieces.length > 0) {
            // 랜덤으로 하나 선택
            const randomPiece = wrongPieces[Math.floor(Math.random() * wrongPieces.length)];
            const correctPosition = parseInt(randomPiece.dataset.position);
            const correctCell = this.gridCells[correctPosition];
            
            // 현재 위치에서 제거
            if (randomPiece.parentElement) {
                randomPiece.parentElement.classList.remove('occupied');
            }
            
            // 정답 위치로 이동
            this.placePiece(randomPiece, correctCell);
            
            // 이동 효과
            randomPiece.style.animation = 'slideIn 0.5s ease';
        }

        if (this.hintsLeft === 0) {
            this.hintBtn.disabled = true;
            this.hintBtn.textContent = '힌트 소진됨';
        }
    }

    shufflePieces() {
        // 그리드에서 모든 조각 제거
        this.gridCells.forEach(cell => {
            while (cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
            cell.classList.remove('occupied');
        });

        // 모든 슬롯 비우기
        this.clearAllSlots();
        
        // 다시 분배
        if (this.puzzlePieces.length > 0) {
            this.distributePieces();
        }
    }

    clearAllSlots() {
        [this.topSlots, this.leftSlots, this.rightSlots, this.bottomSlots].forEach(container => {
            container.innerHTML = '';
        });
    }

    resizePuzzlePieces() {
        // 고정 크기이므로 리사이즈 불필요
    }

    resetHints() {
        this.hintsLeft = 5;
        this.hintCount.textContent = this.hintsLeft;
        this.hintBtn.disabled = false;
        this.hintBtn.innerHTML = '힌트보기 (<span id="hintCount">5</span>)';
        this.hintCount = document.getElementById('hintCount');
    }

    checkCompletion() {
        const correctPieces = this.gridCells.filter(cell => {
            const piece = cell.firstChild;
            if (!piece) return false;
            
            const piecePosition = parseInt(piece.dataset.position);
            const cellPosition = parseInt(cell.dataset.position);
            return piecePosition === cellPosition;
        });

        if (correctPieces.length === this.totalPieces) {
            // 완성 효과
            this.puzzleGrid.classList.add('puzzle-complete');
            
            // 완성 효과음 재생
            try {
                this.completeSound.currentTime = 0;
                this.completeSound.play().catch(e => console.log('완성 효과음 재생 실패:', e));
            } catch (e) {
                console.log('완성 효과음 재생 실패:', e);
            }
            
            setTimeout(() => {
                this.puzzleGrid.classList.remove('puzzle-complete');
                alert('가야의 유물을 찾았습니다!\n가야 기마인물형토기 🏛️✨');
            }, 2400); // 애니메이션 완료 후
        }
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});