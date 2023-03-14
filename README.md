# lottery-api-server

# 📖 목차 
 - [소개](#소개) 
 - [사용법](#사용법)
 - [구조 및 설명](#구조-및-설명)
 - [흐름도](#흐름도)
 - [개발 환경](#개발-환경)
 - [Api 명세서](#api-명세서)
        
# 소개 
 - goerli 네트워크에 베포된 [Lottery Truffle](https://github.com/keeepmin94/Lottery_truffle "Lottery Contract") Contract와 연동하며 작동하는 API 서버

```
💡 Lottery 
   플레이어를 등록 후 소량의 ether를 지불후 게임에 참가. 
   랜덤으로 우승자를 선정한 후 상금을 우승자에게 전송
```
## 사용법

- 사용자 등록
  - 사용자의 account name, account, private key 등록
  - 트랜잭션을 생성할 때 사용자의 private key로 서명이 필요
  - API 서버를 통해 트랜잭션을 처리할 예정이므로, API 서버에서 사용자의 private key를 통해 대신 서명 해야함
![](https://velog.velcdn.com/images/keepmin/post/3e6ccbda-50e5-4154-bf5d-154295711f74/image.png)

- 플레이어 참가
  - 등록된 사용자 한에 게임 참가
  - 기존 사용자 등록시 저장된 pk로 서명 & 거래 생성
![](https://velog.velcdn.com/images/keepmin/post/48311313-7aca-40d4-9129-6a0151a1f488/image.png)

- 우승자 선정
  - 랜덤한 값으로 참가한 플레이어중 우승자를 뽑아서 상금 전송
![](https://velog.velcdn.com/images/keepmin/post/463c3faf-ef97-4fc5-9eb4-8f2ac4b8544b/image.png)

- 참가한 플레이어 조회
- 적립된 상금 조회
- 게임 횟차수 조회
- n회차 Lottery 게임우승자 조회
- 플레이어 잔액 조회


### 구조 및 설명
- config : 환경변수 등 서버 설정 파일 모음
  - appConfig.js
  - db-config.js
  - goerli.env
  - development.env
- constatnts :서버에서 공통적으로 사용하는 상수 모음
  - errorCodes.js
- contractAbis : 컨트랙트 ABI 파일 모음
  - Lottery.json
- controllers : 각 API에 대해 로직적인 부분을 처리하는 부분
  - LotteryController.js
  - WalletController.js
- models : DB 세팅 및 테이블 정의하는 곳
  - index.js
  - Wallte.js
- routes : API 설정하는 곳
  - api
    - index.js
    - wallte.js
    - lottery.js
  - index.js
  - users.js
- services : DB 및 컨트랙트와 직접적으로 상호작용하는 부분,
  - contract
    - ContractUtil.js
    - LotteryInteractor.js
  - db
    - WalletDBInteractor.js
- .sequelizerc : sequelize 디폴트 config 파일 path 조정하는 부분
- docker-compose.yml : 도커 컴포즈로 DB 컨테이너 생성


### 흐름도
![](https://velog.velcdn.com/images/keepmin/post/95a844bb-ec71-4fb9-816b-57fcd693a61f/image.png)


### 개발 환경
- 언어
    - Node.js
- 프레임워크
    - Express
- Database
    - MySQL
- API Test
    - Postman

### API 명세서
---
사용자 관련
```
/wallet                                    [Post] // @Description 사용자 DB 등록

```

Lottery Contract 관련
```
/lottery/enter         	                   [Post] // @Description Loterry 게임 입장
/lottery/balance                           [GET]  // @Description Lottery에 적립된 상금 조회
/lottery/players                           [GET]  // @Description 참가한 플레이어 조회
/lottery/id  		                            [GET]  // @Description Lottery 게임 횟차수 조회
/lottery/history?lottery_id=i  		          [GET]  // @Description i회차 Lottery 게임우승자 조회
/lottery/player/balance?account_name=Å     [GET]  // @Description Å의 지갑 주소 잔액
/lottery/winner 		                         [Post] // @Description Lottery 게임 우승자 뽑기
``` 
