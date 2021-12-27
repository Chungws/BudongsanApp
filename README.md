# 부동산 매물 거래 앱

## 기술 스택
React + Firebase

## 디자인
Material-UI

## Ver.1.0
이전 버전
* 매물조회 페이지 Material-UI의 Table로 구성
* React Class Component로 구성
* 위 repository의 첫 커밋

## Ver.2.0
이전 버전 <br/>
2021.12.04 ~ 2021.12.17 동안 개발

#### 전체
* 이미지 저장을 위해 firebase storage 도입
* 로딩 구현

#### 메인 페이지 (로그인 페이지)
* 디자인 개편, 모바일도 적용 가능하게 변경

#### 매물조회 페이지 
* Material-UI Table에서 DataGrid로 변경
* 모바일 페이지 작성
* Appbar 삭제
* DataGrid select기능으로 삭제 수정 구현
* 함수형으로 리팩토링
* 매물 당 저장된 이미지 Dialog로 볼 수 있도록 구현
* 위 이미지 Dialog에서 각각 이미지 다운로드 가능하게 구현
* 대지, 매매가, 보증금, 월세 등 숫자데이터 양식 적용 (react-number-format 라이브러리)

#### 매물관리 페이지
* Create, Update 페이지 통합
* 날짜 입력할 때 DatePicker 도입 (Material-UI/lab)
* 함수형으로 리팩토링
* 이미지 업로드 ImageUploader 도입 (react-images-upload 라이브러리)
* 새로 입력할 매물 기존 매물들 주소랑 중복 불가 기능 구현
* 수정시 주소 수정 불가하게 설정
* 모바일 매물관리 페이지 기존 매물관리 페이지에 구현

#### 모바일 매물조회 페이지 (새로 작성)
* List로 구현 후 매물 누르면 정보 나타나게 구현
* 매물 정보 + 사진 공유 가능하도록 기능 추가 (Web Share API)

## Ver.2.1
현재 버전 <br/>
2021.12.23 ~ 2021.12. 동안 개발

#### 매물조회 페이지
* Image, PDF 새창으로 띄워 확대기능 추가
* HWP 뷰어 추가 (hwp.js 라이브러리)

#### 매물관리 페이지
* PDF, HWP 파일 업로드 기능 추가
