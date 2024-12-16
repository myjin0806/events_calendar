/* 
  달력제목
  날짜가 들어갈 부분
  이벤트 추가팝업
  팝업에 표시되는 날짜 선택
  팝업내에 이벤트 입력창
  닫기, 저장
  리스트 표시영역
*/

//DOM요소 가져오기
let calendarTitle = document.getElementById('calendar-title');
let calendarBody = document.getElementById('calendar-body');
let eventPopup = document.getElementById('event-popup');
let popupDate = document.getElementById('popup-date');
let popupEventInput = document.getElementById('popup-event-input');
let saveEventButton = document.getElementById('save-event-button');
let closeEventButton = document.getElementById('close-event-button');
let eventList = document.getElementById('event-list');
let deleteSelectedButton = document.getElementById('delete-selected-button');
let deleteAllButton = document.getElementById('delete-all-button');
let selectAllButton = document.getElementById('select-all-button');

//현재 날짜,선택된 날짜, 이벤트 데이터 저장
let currentDate = new Date();
let selectedDate = null; //사용자가 클릭한 날짜 저장 함수
let events = {}; //이벤트 데이터 저장하는 객체(키:날짜, 값: 이벤트 배열)
/* 달력 렌더링 함수 */
function renderCalendar(date){
  const year = date.getFullYear();
  const month = date.getMonth();
  //달력 제목 업데이트
  calendarTitle.textContent = `${year}년 ${month+1}월`;
  let firstDay = new Date(year, month, 1).getDay(); //현재달의 첫째 날의 요일
  let lastDate = new Date(year, month + 1, 0).getDate();  //현재 달의 마지막 날짜
  let prevLastDate = new Date(year, month, 0).getDate();  //이전 달의 마지막 날짜
  calendarBody.innerHTML='';
  let row = document.createElement('tr');
  //이전 달 날짜 채우기
  for(let i = 1; i < firstDay; i++){
    const cell = document.createElement('td'); //셀 생성
    cell.textContent = prevLastDate - firstDay + i -1;
    cell.classList.add('prev-month-date');//이전 달 날짜 스타일 추가
    row.appendChild(cell);
  }
  //현재 달 날짜 채우기
  for(let day = 1; day <= lastDate; day++){
    //만약에 시작일이 1일로 시작, 끝나는 날 께산 반복된다. 1씩 증가한다
    //7개의 td가 가득차면 row 추가하고 tr 추가해야된다
    if(row.children.length ===7){
      calendarBody.appendChild(row);//현재 행을 달력에 추가
      row = document.createElement('tr');
    }
    const cell = document.createElement('td'); //날짜 셀 생성
    cell.textContent = day; //날짜 삽입
    
    //오늘 날짜 강조 표시
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth()&& day === today.getDate()){
      cell.classList.add('today-date');
    }
    
    //날짜 클릭 이벤트 추가
    cell.addEventListener('click', ()=>{
      selectedDate = `${year}-${month+1}-${day}`
      popupDate.textContent = `선택된 날짜: ${selectedDate}`;
      eventPopup.classList.remove('hidden');
    });
    row.appendChild(cell);
  }
  //다음 달 채우기
  let nextMonthDay = 1;
  while(row.children.length < 7){
    const cell = document.createElement('td');
    cell.textContent = nextMonthDay++ ; //다음 달 날짜 설명
    cell.classList.add('next-month-date');
    row.appendChild(cell);
  }
  calendarBody.appendChild(row);
}

/* 이벤트 저장 */
saveEventButton.addEventListener('click', ()=>{
  const eventText = popupEventInput.value.trim();
  if(!eventText|| !selectedDate) return;
  if(!events[selectedDate]) events[selectedDate] =[];
  events[selectedDate].push(eventText);
  popupEventInput.value='';
  eventPopup.classList.add('hidden');
  renderEventList();
})

/* 이벤트 리스트 렌더링 */
function renderEventList(){
  eventList.innerHTML = '';
  //event객체를 순회하며 이벤트 표시 
  for(const date in events){
    events[date].forEach((event,index) => {
      const item = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('event-checkbox');

      const text = document.createElement('span');
      text.textContent = `${date} : ${event}`;
      text.style.marginLeft = '10px';
      
      //삭제버튼생성
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '삭제';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', ()=>{
        events[date].splice(index, 1); //해당 이벤트 삭제
        if(events[date].length === 0)delete events[date]; //이벤트가 없으면 날짜 삭제
        renderEventList();
      });
      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(deleteButton);
      eventList.appendChild(item);
    });
  }
}

/* 선택된 이벤트 삭제 */
deleteSelectedButton.addEventListener('click', ()=>{
  let checkboxes = document.querySelectorAll('.event-checkbox');
  checkboxes.forEach((checkbox)=>{
    if (checkbox.checked){ //체크박스가 체크가 되어있을 때
      let parentDiv = checkbox.parentElement;
      let dateText = parentDiv.querySelector('span').textContent;
      //이벤트 항목에서 날짜, 텍스트정보 가져오기
      let [date, eventText] = dateText.splice(':');
      //이벤트 배열에서 삭제하려는 이벤트의 인덱스 확인
      //events[date] date키에 해당하는 배열 가져오기
      //events['2024-22-26']=['삼겹살']
      let eventIndex = events[date].indexOf(eventText.trim());
      if(eventIndex > -1){
        events[date].splice(eventIndex, 1);
        if(events[date].length === 0) delete events[date]
      }
    }
  });
  renderEventList();
});

/* 모든 이벤트 삭제 */ 
deleteAllButton.addEventListener('click', ()=>{
  let events ={};
  renderEventList();
});

/* 팝업 닫기 */
closeEventButton.addEventListener('click', ()=>{
  eventPopup.classList.add('hidden');
});

/* 이전 달로 이동 */
document.getElementById('prev-month').addEventListener('click',()=>{
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

/* 다음 달로 이동 */
document.getElementById('next-month').addEventListener('click',()=>{
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

/* 전체 선택/해제 */
selectAllButton.addEventListener('click', ()=>{
  let checkboxes = document.querySelectorAll('.event-checkbox');
  let allChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);
  checkboxes.forEach((checkbox)=>{
    checkbox.checked = !allChecked; //모두 선택되어있다면 해제/ 아니면 선택 
  })
})

/* 전체 삭제 */
deleteAllButton.addEventListener('click', ()=>{
  events = {}; // 이벤트 데이터 초기화
  renderEventList(); // 리스트 갱신
});

/* 선택된 이벤트 삭제 */
deleteSelectedButton.addEventListener('click', ()=>{
    const checkboxes = document.querySelectorAll('.event-checkbox'); // 모든 체크박스 선택
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) { // 체크된 항목만 처리
      const parentDiv = checkbox.parentElement; // 체크박스의 부모 요소 가져오기
      const dateText = parentDiv.querySelector('span').textContent; // 날짜와 이벤트 텍스트 가져오기
      const [date, eventText] = dateText.split(' : '); // 날짜와 이벤트 내용 분리

      // 이벤트 배열에서 삭제하려는 이벤트의 인덱스 확인 후 삭제
      const eventIndex = events[date].indexOf(eventText.trim());
      if (eventIndex > -1) {
        events[date].splice(eventIndex, 1); // 배열에서 해당 이벤트 삭제
        if (events[date].length === 0) {
          delete events[date]; // 날짜에 더 이상 이벤트가 없으면 해당 키 삭제
        }
      }
    }
  });
  renderEventList(); // 이벤트 리스트 갱신
});

/* 초기화 */
renderCalendar(currentDate);
renderEventList();