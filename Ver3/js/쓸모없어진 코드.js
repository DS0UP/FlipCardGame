/**
 * 랜덤 아이템을 빈 슬롯에 추가하는 함수
 * 
 * 슬롯을 검색하여 빈 슬롯에 랜덤으로 아이템을 할당
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

//모달 시스템 테스트
function showModal() {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.modal-overlay');
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
    
    setTimeout(() => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }, 2000);
}

function showModalWithImage(imageName) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    
    // 이미지 경로 자동 설정
    const imageSrc = `cardImages/${imageName}.png`;
    
    // 기존 이미지 제거
    modalContent.innerHTML = '';
    
    // 새 이미지 추가
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    modalContent.appendChild(img);
    
    // 모달 표시
    modal.style.display = 'block';
    overlay.style.display = 'block';
    
    // 3초 후 모달 닫기
    setTimeout(() => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }, 3000);
}