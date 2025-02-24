let isGameStarted = false;
let currentRound = 0;
let isRoundCleared = false;
let CARD_PER_COLUMN = 6;
let CARD_PER_ROW = 5;
let isFlipping1 = false;
let isFlipping2 = false;
let flippedCards = [];
let timerId;

let score = 0;
let sec = 0;

let roundTime = [20, 30, 40, 50, 60];
let roundColumn = [3, 6, 6, 6, 6];
let roundRow = [2, 2, 3, 4, 5];

const flipContainer = document.querySelector('.flip');
const cardValues = [];
const newCard = [];

let startPoint = {X: 0, Y: 0};

const timerContainer = document.querySelector(".timer")
const timerDisplay = document.getElementById('timerDisplay');

const itemContainer = document.getElementById('items');
const itemTypes = ['시간 추가', '아이템 B'];

/**
 * 게임 시작 함수
 */
function gameStart() {
    document.getElementById("score").textContent = score;
    currentRound = 0;
    createItemSlots(5);
    gameSet(currentRound);
    isGameStarted = true;
    startTimer(roundTime[currentRound]);
}

/**
 * 게임 세팅하는 함수
 * @param {*} round 
 */
function gameSet(round) {
    CARD_PER_COLUMN = roundColumn[round];
    CARD_PER_ROW = roundRow[round];

    // 카드 및 배열 초기화
    flipContainer.innerHTML = "";
    cardValues.length = 0;
    newCard.length = 0;

    for (let i = 0; i < (CARD_PER_ROW * CARD_PER_COLUMN) / 2; i++) { // 두쌍
        cardValues.push(i);
        cardValues.push(i);
    }

    //셔플
    cardValues.sort(() => Math.random() - 0.5);

    for (let i = 0; i < CARD_PER_ROW * CARD_PER_COLUMN; i++) {
        newCard.push(createCard(cardValues[i]))
        flipContainer.appendChild(newCard[i]);
    }   

    flipContainer.style.display = 'grid';
    flipContainer.style.gridTemplateRows = `repeat(${CARD_PER_ROW}, 1fr)`;
    flipContainer.style.gridTemplateColumns = `repeat(${CARD_PER_COLUMN}, 1fr)`;
    flipContainer.style.gap = '1rem';
}

/**
 * 카드를 생성하는 함수
 * @returns Tag Card
 */
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.currentRotate = {X: 0, Y: 0}; // 각 카드마다 개별적으로 회전 상태를 저장

    // 앞면 생성
    const front = document.createElement('div');
    front.classList.add('front');

    const frontHeading = document.createElement('h1');
    frontHeading.textContent = value;
    front.appendChild(frontHeading); // 앞면에 제목 추가

    // 뒷면 생성
    const back = document.createElement('div');
    back.classList.add('back');

    const backHeading = document.createElement('h1');
    backHeading.textContent = '뒷면';
    back.appendChild(backHeading); // 뒷면에 제목 추가

    // 앞면과 뒷면을 카드에 추가
    card.appendChild(front);
    card.appendChild(back);

    rotateCard(card);
    
    return card;
}

/**
 * 드래그 계산 함수
 * @param {*} start 시작 좌표
 * @param {*} end 종료 좌표
 * @returns 
 */
const calculateRotation = (start, end) => {
    const tmpX = end.X - start.X;
    const tmpY = end.Y - start.Y;

    if (Math.abs(tmpX) >= Math.abs(tmpY)) {
        return {X: 0, Y: tmpX > 0 ? 180 : -180};
    }
    else {
        return {X: tmpY > 0 ? 180 : -180, Y: 0};
    }
}

/**
 * 드래그 마우스 이벤트 생성 함수
 * @param {*} selectedCard 
 */
function rotateCard(selectedCard) {
    selectedCard.addEventListener('mousedown', (e) => {
        startPoint = {X: e.pageX, Y: e.pageY};
    });

    selectedCard.addEventListener('mouseup', (e) => {
        const endPoint = {X: e.pageX, Y: e.pageY};
        const rotation = calculateRotation(startPoint, endPoint);

        if (isFlipping2 || selectedCard.classList.contains('flipped')) {
            return;
        }

        selectedCard.currentRotate.X += rotation.X;
        selectedCard.currentRotate.Y += rotation.Y;
        
        flipCard(selectedCard);
    });
}

/**
 * 모든 카드가 뒤집혀져 있는지 확인하는 함수
 */
function checkRoundClear() {
    let allFlipped = document.querySelectorAll('.card.flipped').length === CARD_PER_ROW * CARD_PER_COLUMN;
    if (allFlipped) {
        if (timerId) clearInterval(timerId); // 기존 타이머 정리
        setTimeout(nextRound, 3000);
        showRound();
    }
}

/**
 * 회전 후 같은지 판별 하는 함수
 * @param {card} selectedCard 
 * @returns 
 */
function flipCard(selectedCard) {
    if (!isGameStarted || isFlipping2 || selectedCard.classList.contains('flipped')) {
        return;
    }
    
    selectedCard.classList.add('flipped');
    isFlipping1 = true;
    flippedCards.push(selectedCard);
    selectedCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;

    if (flippedCards.length === 2) {
        isFlipping2 = true;

        let [firstCard, secondCard] = flippedCards;
        if (firstCard.dataset.value === secondCard.dataset.value) {
            score += 55;
            document.getElementById("score").textContent = score;
            flippedCards = [];
            isFlipping1 = false;
            isFlipping2 = false;
            checkRoundClear();
        } else {
            setTimeout(() => { //  초 후 제거
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.currentRotate = {X: 0, Y: 0};
                secondCard.currentRotate = {X: 0, Y: 0};
                flippedCards = [];
                isFlipping1 = false;
                isFlipping2 = false;
                firstCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;
                secondCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;
            }, 1000);
        }
    }
}

/**
 * 타이머 시작 함수
 */
function startTimer(ssec) {
    sec = ssec;
    timerDisplay.textContent = sec + "초";
    var num = 360;
    timerContainer.style.setProperty("--timerA", num + "deg")

    timerId = setInterval(() => {
        sec--;

        timerContainer.style.setProperty("--timerA", num + "deg");
        if (sec < 10) {
            timerContainer.style.background = ` conic-gradient(crimson var(--timerA) ,crimson 0deg ,#293047 0deg,#293047 360deg)`
        } else {
            timerContainer.style.background = ` conic-gradient(#E1E2E7 var(--timerA) ,#E1E2E7 0deg ,#293047 0deg,#293047 360deg)`
        }
        num = num - (num / sec);

        timerDisplay.textContent = sec + "초";

        if (sec < 0) {
            clearInterval(timerId);
            isGameStarted = false;
            timerDisplay.textContent = "끝";
        }
    }, 1000);
}

/**
 * 다음 라운드 보여주는 애니메이션
 * @returns 
 */
function showRound() {
    const roundBox = document.getElementById("roundBox");
    const text = document.getElementById("roundText");

    if (!roundBox || !text) return;

    roundBox.style.transition = `transform 500ms linear`;
    roundBox.style.transform = "translate(0, 0)";

    text.innerText = `${currentRound+2}라운드`;
    text.style.transition = `transform 3000ms linear`;
    text.style.transform = "translate(100vw, 0)";

    setTimeout(() => {
        roundBox.style.transform = "translate(0%, -100%)";
    }, 3000);
    setTimeout(() => {
        text.style.transform = "translate(-100vw, 0)";
    }, 4000);
}

/**
 * 주어진 수만큼 아이템 슬롯을 생성하고, 슬롯 클릭 시 해당 아이템에 따라 동작을 수행하는 함수
 * @param {*} slotCount 아이템 슬롯 개수
 */
function createItemSlots(slotCount) {
    // 기존 아이템 슬롯 초기화
    itemContainer.innerHTML = '';
    
    for (let i = 0; i < slotCount; i++) {
        const slot = document.createElement('div');
        slot.classList.add('item');
        slot.dataset.slotId = i;
        slot.dataset.item = ''; // 초기 아이템 값 설정
        
        // 슬롯 클릭 시 해당 아이템 확인
        slot.addEventListener('click', function() {
            const item = slot.dataset.item;
            console.log('클릭된 아이템:', item);
            switch (item) {
                case '시간 추가':
                    sec += 10;
                    slot.dataset.item = ''; // 클릭된 슬롯의 데이터 초기화
                    slot.innerText = '';
                    shiftItemsUp();
                    break;
                case '아이템 B':
                    if (isFlipping1) {
                        break;
                    }
                    autoMatch();
                    slot.dataset.item = ''; // 클릭된 슬롯의 데이터 초기화
                    slot.innerText = '';
                    shiftItemsUp();
                    break;
                default:
                    break;
            }
        });
        
        itemContainer.appendChild(slot);
    }
}

/**
 * 아이템이 있는 슬롯을 위로 이동시켜 빈 슬롯을 채우는 함수
 */
function shiftItemsUp() {
    const slots = document.querySelectorAll('.item');
    
    let firstEmptySlotIndex = -1;
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (!slot.dataset.item) {
            if (firstEmptySlotIndex === -1) {
                firstEmptySlotIndex = i;
            }
        } else if (firstEmptySlotIndex !== -1) {
            // 빈 슬롯을 찾은 후, 그 이후 아이템을 위로 이동
            slots[firstEmptySlotIndex].dataset.item = slot.dataset.item;
            slots[firstEmptySlotIndex].innerText = slot.dataset.item;
            slot.dataset.item = '';
            slot.innerText = '';
            firstEmptySlotIndex++;
        }
    }
}

/**
 * 랜덤 아이템을 빈 슬롯에 추가하는 함수
 */
function addRandomItem() {
    const slots = document.querySelectorAll('.item');
    const emptySlots = Array.from(slots).filter(slot => !slot.dataset.item);
    
    if (emptySlots.length > 0) {
        const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const randomSlot = emptySlots[0];
        randomSlot.dataset.item = randomItem;
        randomSlot.innerText = randomItem;
    } else {
        console.log('빈 슬롯이 없습니다');
    }
}

/**
 * 다음 라운드로 이동하는 함수
 */
function nextRound() {
    score += 550;
    document.getElementById("score").textContent = score;
    currentRound++;
    
    if (currentRound < roundColumn.length) {
        addRandomItem();
        gameSet(currentRound);
        startTimer(roundTime[currentRound]);
    } else {
        alert("🎉 게임 클리어! 축하합니다!");
        isGameStarted = false;
    }
}

/**
 * 카드 자동맞추기 아이템 함수
 * @returns 
 */
function autoMatch() {
    const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.flipped)')); // 아직 뒤집지 않은 카드들

    if (unmatchedCards.length < 2) { // 뒤집을 카드가 2개 미만일 경우
        console.log("뒤집을 카드가 부족합니다.");
        return;
    }

    let cardPairs = {}; // 카드 값을 기준으로 짝을 찾기 위한 객체

    // 카드 값별로 그룹화
    unmatchedCards.forEach(card => {
        const value = card.dataset.value; // 카드의 데이터 값
        if (!cardPairs[value]) {
            cardPairs[value] = [];
        }
        cardPairs[value].push(card); // 값에 맞는 카드들 그룹에 추가
    });

    let matchedPair = null; // 매칭된 카드 쌍을 저장할 변수

    // 두 장의 카드가 일치하는 짝을 찾기
    for (let key in cardPairs) {
        if (cardPairs[key].length === 2) { // 짝을 이룬 카드 2개를 찾음
            matchedPair = cardPairs[key];
            break;
        }
    }

    if (matchedPair) { // 짝을 찾았다면
        const [firstCard, secondCard] = matchedPair; // 첫 번째, 두 번째 카드

        // 마우스 이벤트 시뮬레이션
        const mouseUpEvent = new MouseEvent('mouseup', {});

        // 첫 번째 카드와 두 번째 카드에 대해 mouseup 이벤트를 트리거
        firstCard.dispatchEvent(mouseUpEvent);
        secondCard.dispatchEvent(mouseUpEvent);
    } else {
        console.log("매칭 가능한 카드가 없습니다.");
    }
}

gameStart();