시작하기
앱인토스를 연동하기 위해 필요한 API를 소개드려요.
앱인토스 개발을 처음 시작하신다면, 좀 더 친절한 안내를 먼저 확인해보세요! '시작하기' 문서로 바로가기

🚨 주의해주세요

iframe은 사용할 수 없어요.
iframe을 사용할 경우 앱인토스 기능이 정상 동작하지 않고, 내부 보안 심사에서도 반려됩니다.
단, YouTube 영상 콘텐츠를 삽입하는 용도는 예외적으로 iframe 사용이 가능해요.

서버 mTLS 인증서 발급받기
앱인토스 API 사용을 위해서는 필수로 mTLS(mutual TLS, 양방향 인증) 인증서를 설정해야 해요. 이 인증서는 파트너사 서버와 앱인토스 서버 사이의 통신을 암호화하고, 서로 신원을 확인하는 데 사용돼요.
mTLS 인증서가 준비되지 않으셨다면 서버 mTLS 인증서 발급받기를 확인해주세요.

통신 방화벽 확인하기
In/Out Bound 방화벽 관리를 하신다면 아래 IP를 방화벽에 등록해주세요.

가맹점이 허용해야하는 inbound IP 목록(앱인토스 -> 가맹점)

IP	port
117.52.3.11	443
211.115.96.11	443
106.249.5.11	443
117.52.3.80~87	443
211.115.96.80~87	443
106.249.5.80~87	443

가맹점이 허용해야하는 outbound IP 목록(가맹점 -> 앱인토스)

기능	도메인	IP	port
간편 로그인, 메시지 발송, 토스 포인트 지급	apps-in-toss-api-toss.im	117.52.3.192, 211.115.96.192, 106.249.5.192	443
간편 결제	pay-apps-in-toss-api-toss.im	117.52.3.195, 211.115.96.195, 106.249.5.195	443
API 공통규격 확인하기
도메인 정보
https://apps-in-toss-api.toss.im
https://pay-apps-in-toss-api.toss.im

API 공통 응답
성공


// 성공일 경우 resultType이 SUCCESS로 설정되며 해당 API의 응답이 success 하위에 적재됩니다.
{
   "resultType":"SUCCESS",
   "success":{
      "sample":"data"
   }
}
실패


// 실패일 경우 resultType 이 FAIL로 설정되며 해당 실패 사유가 error 하위에 적재됩니다.
{
   "resultType":"FAIL",
   "error":{
      "errorCode":"INVALID_PARAMETER",
      "reason":"요청에 실패했습니다."
   }
}
Pager
Next page
AccessToken 재발급 받기
Refresh Token으로 Access Token을 다시 발급받는 API예요.

Request Body
Schema
JSON

object
기존에 발급된 refresh token을 사용해 access token을 재발급받는 요청이에요.


refreshToken
string
Required
기존에 발급된 refresh token이에요. 이 토큰으로 새 access token을 요청할 수 있어요.

Responses
200
400
요청에 성공해서 재발급된 Access Token 관련 정보가 돌아와요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/user/oauth2/refresh-token
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/refresh-token \
  --request POST \
  --header 'Content-Type: application/json'
Pager
Previous page
시작하기
Next page
AccessToken 받기
Authorization Code로 Access Token과 Refresh Token을 발급하는 API예요.

Request Body
Schema
JSON

object
OAuth2 토큰 발급을 위한 요청 본문이에요.


authorizationCode
string
Required
OAuth2 인증 과정을 통해 발급받은 Authorization Code예요. 이 코드는 사용자 인증을 완료한 뒤 리디렉션 URL에 쿼리 파라미터로 전달돼요.


referrer
string
Required
사용자가 앱에 진입하게 된 유입 경로예요. 예를 들어 딥링크, 푸시 알림, 앱 내 배너 등 어떤 경로로 이 기능을 사용했는지를 의미해요.

Responses
200
400
요청에 성공해서 발급된 토큰 정보가 돌아와요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object
OAuth2 토큰 발급 요청에 대한 응답 정보예요.


POST
/api-partner/v1/apps-in-toss/user/oauth2/generate-token
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token \
  --request POST \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
AccessToken 재발급 받기
Next page
userKey로 로그인 연결 끊기
Access Token으로 연결이 해제된 사용자에 대한 응답이에요. 응답에는 해제된 사용자의 userKey만 포함돼요.

Request Body
Schema
JSON

object

userKey
integer
Required
연결을 해제할 사용자의 고유 식별자예요. 내부 시스템에서 사용자를 식별할 때 사용해요.

Format
int64
Responses
200
400
요청에 성공해서 `userKey`를 기반으로 연결이 해제된 사용자의 `userKey`가 돌아와요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key \
  --request POST \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
AccessToken 받기
Next page
AccessToken 으로 로그인 연결 끊기
Authorization 헤더에 있는 Access Token으로 해당 사용자의 연결을 해제하는 API예요.

Parameters
Header Parameters
Authorization
*
사용자의 Access Token이 담긴 Authorization 헤더 값이에요.

Type
string
Required
Example
Bearer ya29.A0ARrdaM9bZxZJ...
Responses
200
401
요청에 성공해서 Access Token에 해당하는 사용자의 연결을 성공적으로 해제했어요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token \
  --request POST \
  --header 'Authorization: Bearer ya29.A0ARrdaM9bZxZJ...' \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
userKey로 로그인 연결 끊기
Next page
사용자 정보 받기
Access Token을 사용해서 로그인된 사용자의 정보를 조회하는 API예요.

Parameters
Header Parameters
Authorization
*
Bearer 형식의 Access Token이 담긴 Authorization 헤더 값이에요.

Type
string
Required
Example
Bearer ya29.A0ARrdaM9bZxZJ...
Responses
200
401
요청에 성공해서 조회한 사용자 프로필 정보가 응답으로 돌아와요. 일부 항목은 사용자 동의 여부에 따라 `null`일 수 있어요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

GET
/api-partner/v1/apps-in-toss/user/oauth2/login-me
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me \
  --header 'Authorization: Bearer ya29.A0ARrdaM9bZxZJ...' \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
AccessToken 으로 로그인 연결 끊기
Next page
프로모션 토스포인트 지급 결과 조회하기
이 API는 파트너 앱이 토스 유저에게 지급한 토스포인트를 조회할 수 있도록 해줘요

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object

promotionCode
string
Required

key
string
Required
Responses
200
400
401
403
성공적으로 프로모션 지급 결과를 조회했어요
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
string
Valid values
PENDING
SUCCESS
FAILED

POST
/api-partner/v1/apps-in-toss/promotion/execution-result
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execution-result \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
GET
사용자 정보 받기
Next page
프로모션 리워드 지급하기
이 API는 파트너 앱이 토스 유저에게 토스 포인트를 지급할 수 있도록 해줘요

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object

promotionCode
string
Required

key
string
Required

amount
integer
Required
Format
int64
Responses
200
400
401
403
성공적으로 토스유저에게 토스 포인트를 지급했어요
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/promotion/execute-promotion
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
프로모션 토스포인트 지급 결과 조회하기
Next page
프로모션 리워드 지급 키 생성하기
이 API는 파트너 앱이 토스 사용자에게 토스 포인트를 지급하기 위한 키를 발급해줘요.

Responses
200
400
401
403
프로모션 리워드 지급 키 생성에 성공했어요
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/promotion/execute-promotion/get-key
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion/get-key \
  --request POST \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
프로모션 리워드 지급하기
Next page
결제 환불하기
결제 건에 대해 환불을 요청할 수 있어요. 환불 가능 여부와 잔액 조건 등을 사전에 확인해주세요.

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object
토스페이 환불을 위한 요청 본문이에요.


payToken
string
Required
토스페이 토큰 (승인할 결제 건의 토큰값)

Max Length
30

reason
string
환불 사유

Max Length
55

isTestPayment
boolean
Required
샌드박스일 경우 false, 라이브앱일 경우 true(true 면 실결제)

Responses
200
400
환불 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/pay/refund-payment
Samples

cURL

JavaScript

PHP

Python

curl https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/refund-payment \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
프로모션 리워드 지급 키 생성하기
Next page
결제 생성하기
결제를 생성합니다.

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object
토스페이 결제 생성을 위한 요청 본문이에요.


orderNo
string
Required
가맹점의 상품 주문번호 (숫자,영문자,특문자(_-:.^@) 사용가능)

Max Length
50

productDesc
string
Required
상품설명(한글 포함 시 인코딩 유의)

Max Length
255

amount
integer
Required
총 결제 금액

Format
int64
Max Length
7

amountTaxFree
integer
Required
결제 금액 중 비과세 금액(과세 상품이면 0)

Format
int64
Max Length
7

amountTaxable
integer
결제 금액 중 과세 금액(별도의 과세액을 설정하지 않고, 비과세 금액을 0원으로 보내주시면 토스페이 서버에서 자동으로 과세와 부가세를 계산합니다.

Format
int64
Max Length
7

amountVat
integer
결제 금액 중 부가세(값이 없으면 환불할 과세 금액을 11로 나눈 후 소수점 첫째 자리에서 올림으로 계산합니다.)

Format
int64
Max Length
7

amountServiceFee
integer
결제 금액 중 봉사료

Format
int64
Max Length
7

enablePayMethods
string
TOSS_MONEY/CARD or null

Max Length
100

cashReceipt
boolean
현금영수증 발급 가능 여부(null 일 경우 미발급)


cashReceiptTradeOption
string
현금영수증 발급 타입(CULTURE(문화비)/GENERAL(일반(기본값))/PUBLIC_TP(교통비))

Max Length
10

installment
string
할부 제한 타입(USE(할부사용(기본값))/NOT_USE(할부 미사용))

Max Length
10

isTestPayment
boolean
Required
샌드박스일 경우 false, 라이브앱일 경우 true(true 면 실결제)

Responses
200
400
결제 생성 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object
토스페이 결제 생성 요청 응답입니다.


POST
/api-partner/v1/apps-in-toss/pay/make-payment
Samples

cURL

JavaScript

PHP

Python

curl https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/make-payment \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
결제 환불하기
Next page
결제 상태 조회하기
사용자가 요청한 결제 상태를 조회할 수 있어요.

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object
결제 상태 조회 요청 파라미터예요.


payToken
string
결제를 식별하는 키예요. 요청할 때 이 값과 orderNo 둘 중 하나는 필수예요.


orderNo
string
주문 번호예요. 요청할 때 이 값과 payToken 둘 중 하나는 필수예요.


isTestPayment
boolean
Required
테스트 결제인지 나타내요.

Responses
200
404
결제 상태 정보가 반환돼요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object
결제 상태 조회 응답 정보예요.


POST
/api-partner/v1/apps-in-toss/pay/get-payment-status
Samples

cURL

JavaScript

PHP

Python

curl https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/get-payment-status \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
결제 생성하기
Next page
결제 실행하기
결제 인증이 끝난 결제 건을 승인요청합니다.

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object
사용자 인증이 된 결제건에 대한 승인 요청 본문이에요


payToken
string
Required
토스페이 토큰 (승인할 결제 건의 토큰값)

Max Length
30

orderNo
string
가맹점의 상품 주문번호 (숫자,영문자,특문자(_-:.^@) 사용가능)

Max Length
50

isTestPayment
boolean
Required
샌드박스일 경우 false, 라이브앱일 경우 true(true 면 실결제)

Responses
200
400
결제 승인 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/pay/execute-payment
Samples

cURL

JavaScript

PHP

Python

curl https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/execute-payment \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
결제 상태 조회하기
Next page
결제 상태 조회하기
생성된 결제건의 거래 상태와 거래 트랜잭션을 조회할 수 있습니다. 상황에 따라, 승인 응답을 수신하지 못한 경우에도 활용 가능합니다.

Request Body
Schema
JSON

object

orderId
string
Required
Responses
200
인앱 결제 상태 조회에 성공했어요
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object

POST
/api-partner/v1/apps-in-toss/order/get-order-status
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/order/get-order-status \
  --request POST \
  --header 'Content-Type: application/json'
Pager
Previous page
POST
결제 실행하기
Next page
메시지 발송하기
이 API는 파트너 앱이 토스 사용자에게 알림 또는 메시지를 전송할 수 있게 해줘요. 사용자 인증 토큰이 필요하며, 사용자에게 메시지를 전송할 수 있는 scope 권한이 포함돼야 해요.

Parameters
Header Parameters
x-toss-user-key
*
사용자를 인증하기 위한 키예요.

Type
string
Required
Example
toss-user-key-abc123
Request Body
Schema
JSON

object
사용자에게 보낼 메시지를 정의해요. 어떤 메시지 템플릿을 사용할지와 템플릿에 들어갈 데이터를 함께 담아요.


templateSetCode
string
Required
사용할 메시지 템플릿 코드예요. 사전에 등록한 템플릿 코드 중 하나를 넣어요.


context
object
Required
템플릿에서 사용할 변수값들이에요. 예를 들어 사용자 이름이나 인증번호 같은 값을 넣어요.

Responses
200
400
401
403
메시지 전송에 성공했어요
Content-Type
application/json
Schema
JSON

object

resultType
string
Valid values
SUCCESS
HTTP_TIMEOUT
NETWORK_ERROR
EXECUTION_FAIL
INTERRUPTED
INTERNAL_ERROR
FAIL

error
object

success
object
채널별로 몇 건의 메시지가 전송됐는지와 성공/실패한 메시지의 상세 정보가 담겨 있어요.


POST
/api-partner/v1/apps-in-toss/messenger/send-message
Samples

cURL

JavaScript

PHP

Python

curl https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/messenger/send-message \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Toss-User-Key: toss-user-key-abc123'
Pager
Previous page
POST
결제 상태 조회하기
이해하기
마찰을 줄이면 전환율은 올라가고, 결제 실패 및 이탈은 줄어들어요.
토스페이를 통해 실물 상품/서비스 결제를 빠르고 매끄럽게 진행하세요.

토스페이가 무엇인가요?
토스페이는 사용자들이 토스 앱에서 빠르고 안전하게 결제할 수 있도록 지원하는 간편결제 서비스예요.
미리 등록한 결제 정보를 활용해 비밀번호만으로 간단히 결제할 수 있는 서비스로서, 공인인증서와 같은 복잡한 인증 절차 없이 빠르고 편리하게 결제를 완료할 수 있어요.



토스페이를 사용하면 무엇이 좋은가요?
간편결제 사용자가 서비스에 만족하는 비율은 95%로, 고객 만족도를 개선할 수 있어요.
토스머니, 카드 등 상황에 맞는 수단을 자유롭게 선택할 수 있어요.
결제 과정에서 발생하는 심리적 장벽을 낮추고 결제전환에 도움을 주어 이탈을 방지할 수 있어요.
참고해 주세요
기존에 토스페이를 이용하고 있더라도, 앱인토스의 토스페이 가맹점 key를 발급 받아서 사용해야 해요.
주문번호를 중복 사용 시 결제 생성이 거절돼요.
상품명·수량·총액·할인·환불 규정을 결제 전에 분명히 고지해야 해요.
Pager
Previous page
QA 진행하기콘솔 가이드
1. 계약하기
토스페이 사용을 위해 사전 서류 준비 및 서면(지류) 계약이 필요해요.

채널톡으로 정보를 입력해 주시면 입력된 정보를 기반으로 토스페이팀에서 1차적으로 검토를 진행해요.
이후 추가 확인이 필요한 경우 청약 담당자 메일로 안내 드려요.
청약 서류 작성 및 제출을 해주시면 내부 검수를 거쳐 토스페이 키값을 발급받게 되며, 보통 영업일 기준 7~14일 소요돼요.
2. 설정하기
계약 완료 후 메일로 받은 토스페이 키값을 콘솔에 등록해 주세요.

워크스페이스 → 연동 키 → 등록 버튼에서 가맹점 키를 입력할 수 있어요.
※ 기존에 사용하던 토스페이 키값이 아닌 앱인토스 전용 토스페이 키값을 입력해 주세요.
테스트용 API 키: sk_test_w5lNQylNqa5lNQe013Nq
※ 테스트 키는 결제 생성까지만 가능하며, 승인 처리는 불가합니다.




Pager
Previous page
개발하기


BaseURL

https://pay-apps-in-toss-api.toss.im

1. 결제 생성하기
결제 건을 생성합니다.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/pay/make-payment

요청 헤더

이름	타입	필수값 여부	설명
x-toss-user-key	string	Y	토스 로그인을 통해 획득한 userKey 값
요청 파라미터

이름	타입	필수	설명
orderNo	String	Y	가맹점의 주문번호
주문번호는 반드시 가맹점별로 매회 유니크해야 하며, 중복될 경우 결제 생성 요청이 실패합니다.
- ‘숫자, 영문자, 특수문자 _-:.^@’ 만 사용 가능하며, 50자 이내여야 합니다.
- 동일 주문번호는 구매자 인증 완료 이후 절대 재사용이 불가합니다.
- 최초 생성 후 2년이 지난 주문번호는 재사용할 수 없습니다.
- 테스트 환경과 라이브 환경 간의 주문번호 충돌 방지를 위해 가맹점 관리가 필요합니다.
productDesc	String	Y	상품 설명
상품 설명은 공백으로만 설정할 수 없고, 백슬래시 \ 와 따옴표 ,를 포함할 수 없으며 총 255자 이내여야 합니다. 이 값에 한글이 포함되었다면 인코딩에 유의해주세요.
토스 인코딩 방식은 UTF-8 형식을 사용합니다.
amount	Integer	Y	총 결제 금액
금액과 관련된 모든 파라미터는 숫자 형태로 보내주셔야 에러가 발생하지 않습니다.
amountTaxFree	Integer	Y	결제 금액 중 비과세 금액
판매하시는 상품이 과세 품목이면 해당 값을 0으로 보내주세요.
비과세액은 필수값이니 빈 값으로 보내주시는 경우 에러가 발생합니다.
amountTaxable	Integer	N	결제 금액 중 과세 금액
별도의 과세액을 설정하지 않고, 비과세 금액을 0원으로 보내주시면 토스페이 서버에서 자동으로 과세와 부가세를 계산합니다.
amountVat	Integer	N	결제 금액 중 부가세
값이 없으면 환불할 과세 금액을 11로 나눈 후 소수점 첫째 자리에서 올림으로 계산합니다.
amountServiceFee	Integer	N	결제 금액 중 봉사료
봉사료 금액입니다.
enablePayMethods	String	N	결제수단 구분 변수
가맹점 필요에 따라 결제창에 노출하는 결제수단을 제어할 수 있습니다.
- TOSS_MONEY : 결제수단 중 토스머니만 노출
- CARD : 결제수단 중 카드만 노출
- null 또는 그 외의 값 : 상점에 설정된 기본 결제수단으로 노출
cashReceipt	boolean	N	현금영수증 발급 가능 여부
현금영수증 기능을 활용하시는 경우 true, 미사용의 경우 false 로 선언해 주시기 바랍니다.
반드시 true 또는 false 값을 전달해 주셔야 하고, null 과 같은 비정상 값을 전달할 경우 해당 필드는 명시적으로 false 로 처리됩니다.
cashReceiptTradeOption	String	N	현금영수증 발급 타입
- GENERAL : 일반(기본 값)
- CULTURE : 문화비
- PUBLIC_TP : 교통비
installment	String	N	할부 제한 타입
신용카드 결제 시, 사용자의 할부 선택을 제한할 수 있습니다.
- USE : 할부 사용 (기본값)
- NOT_USE : 할부 미사용
isTestPayment	boolean	Y	샌드박스 결제 요청이면 true, 라이브앱 결제 요청이면 false

curl --location 'https://{{domain}}/api-partner/v1/apps-in-toss/pay/make-payment' \
--header 'Content-Type: application/json' \
--header 'x-toss-user-key : 1234' \
--data '{
    "orderNo":"test-20250417-3",
    "productDesc":"test02",
    "amount":10,
    "amountTaxFree":0,
    "isTestPayment":true
}'
응답 파라미터

이름	타입	설명
payToken	String	토스페이 토큰
매회 유니크한 토큰 값이 생성됩니다.
가맹점에서는 이 값을 반드시 저장하고 관리하셔야 합니다.

{
  "resultType": "SUCCESS",
  "success": {
    "payToken": "string"
  }
}
2. 결제 인증하기
SDK를 통해 연동해주세요.

토스페이 결제창을 띄우고, 사용자 인증을 수행해요.
인증이 완료되면 성공 여부를 반환해요.

checkoutPayment 함수는 결제창을 통해 사용자 인증만 해요.
실제 결제 처리는 인증 성공 후 서버에서 별도로 해야 해요.
checkoutPayment를 참고해 주세요.

3. 결제 실행하기
구매자가 결제를 시도하면, 먼저 결제 정보를 생성하고 인증을 받아요.
이때 결제 상태는 '대기' 중이에요. 이후 결제를 실제로 승인하려면 주어진 주문번호와 결제 토큰을 사용해서 이 함수로 생성된 결제를 승인해요.
실제 승인이 완료되면, 구매자의 결제 수단(예: 카드, 계좌)에서 실제로 금액이 출금돼요.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/pay/execute-payment
요청 헤더

이름	타입	필수값 여부	설명
x-toss-user-key	string	Y	토스 로그인을 통해 획득한 userKey 값
요청 파라미터

이름	타입	필수	설명
payToken	String	Y	토스페이 토큰
orderNo	String	N	가맹점 주문번호
isTestPayment	boolean	Y	payToken 이 샌드박스에서 발급된 것이면 true, 라이브앱에서 발급된 것이면 false

curl --location 'https://{{domain}}/api-partner/v1/apps-in-toss/pay/execute-payment' \
--header 'Content-Type: application/json' \
--header 'x-toss-user-key : 1234' \
--data '{
    "payToken":"test-20250417-3",
    "orderNo":"test02",
    "isTestPayment":true
}'
응답

이름	타입	설명
mode	String	결제환경
- LIVE : 실거래용
- TEST : 테스트용
orderNo	String	승인된 상품 주문번호
amount	Integer	상품금액
approvalTime	String	결제건의 승인 처리 시간
결제건의 승인 처리 시간 (yyyy-MM-dd HH:mm:ss)
요청에 따른 결제건 처리 시간입니다. 환불 시에도 동일한 변수로 리턴되므로 구분하여 관리하시기 바랍니다.
stateMsg	String	상태 응답 텍스트 값
정상 응답일 경우 “결제 완료” 로 내려감
discountedAmount	Integer	할인된 금액
할인된 금액이 리턴되며, 할인 적용이 없으면 0으로 리턴됩니다.
할인 금액에는 토스 앱에서 자동 적용되는 즉시할인과 토스 포인트 사용금액이 포함됩니다. 결제 상점에 따라 할인조건은 차이가 있을 수 있습니다.
paidAmount	Integer	지불수단 승인금액
총 금액 중 할인된 금액을 제외한 순수 지불수단 승인금액입니다. 현금영수증 자체 발행을 사용하는 가맹점은 이 값으로 발행 처리해 주시면 됩니다.
payMethod	String	결제수단
- TOSS_MONEY : 토스머니
- CARD : 카드
payToken	String	토스페이 토큰
매회 유니크한 토큰 값이 생성됩니다.
가맹점에서는 이 값을 반드시 저장하고 관리하셔야 합니다.
transactionId	String	거래 트랜잭션 아이디
결제의 거래구분을 위하여 토스 서버에서 유니크한 값을 생성해서 전달드립니다.
매출전표를 호출하거나 환불 진행 시 구분 값으로 활용할 수 있습니다.
cardCompanyCode	String	승인 카드사 코드
cardCompanyName	String	승인 카드사명
cardAuthorizationNo	String	구매자가 확인할 수 있는 카드사 승인번호
정상적인 카드사 승인번호는 라이브 키 결제에서 확인하실 수 있습니다.
spreadOut	String	사용자가 선택한 카드 할부개월
5만원 미만 금액 및 일시불 결제의 경우 0으로 리턴됩니다.
noInterest	String	카드 무이자 적용 여부
- ture : 무이자
- false : 일반
salesCheckLinkUrl	String	신용카드 매출전표 호출 URL
승인된 카드 결제건의 매출전표를 확인할 수 있는 URL 입니다.
구매자의 추가인증 완료 후 거래내역을 확인할 수 있습니다.
cardMethodType	String	카드 타입
승인된 카드의 타입을 구분할 수 있습니다. 예를 들어, 상점의 신용카드 결제 비율을 알고 싶다면 이 값을 활용해주세요.
- CREDIT : 신용카드
- CHECK : 체크카드
- PREPAYMENT : 선불카드
cardNumber	String	마스킹된 카드번호
카드번호 16자리 중 중간자리는 마스킹됩니다.
cardUserType	String	카드 사용자 구분
- PERSONAL : 본인카드
- PERSONAL_FAMILY : 가족카드
- CORP_PERSONAL : 법인지정 결제계좌 임직원
- CORP_PRIVATE : 법인 공용
- CORP_COMPANY : 법인지정 결제계좌 회사 (하나카드만)
cardNum4Print	String	사용자가 선택한 카드의 끝 4자리
사용자가 선택한 결제수단( payMethod)이 ‘카드’ 인 경우 카드번호 끝 4자리를 전달합니다. (카드사에 따라 마스킹이 포함되어 있을 수 있습니다)
cardBinNumber	String	카드 BIN 넘버
카드사에서 준 카드 BIN 번호 (마스킹되어있을 수 있습니다)
100% 신뢰는 불가합니다.
cashReceiptMgtKey	String	현금영수증 관리번호 식별값
국세청 승인번호는 아니며 토스페이에서 자체적으로 만든 식별값입니다. 해당 필드 존재로 현금영수증 발급 구분 가능합니다.
accountBankCode	String	은행 코드
사용자가 선택한 결제수단( payMethod)이 ‘토스머니’인 경우 토스가 정의한 은행 코드를 전달합니다.
accountBankName	String	은행 명
accountNumber	String	계좌번호
계좌번호는 일부 마스킹을 포함하고 있습니다.
msg	String	응답이 성공이 아닌 경우 설명 메시지
errorCode	String	에러 코드

{
  "resultType": "SUCCESS",
  "success": {
    "code": 0,
      "mode": "TEST",
      "orderNo": "20250417-2",
      "amount": 10,
      "approvalTime": "2025-04-17 12:32:10",
      "stateMsg": "결제 완료",
      "discountedAmount": 0,
      "paidAmount": 10,
      "payMethod": "TOSS_MONEY",
      "payToken": "O1NZck9XME8ureeVJVJP67",
      "transactionId": "45a77cf4-5577-4d5c-8827-4d4dd328bf12",
      "cardCompanyCode": null,
      "cardCompanyName": null,
      "cardAuthorizationNo": null,
      "spreadOut": null,
      "noInterest": null,
      "salesCheckLinkUrl": null,
      "cardMethodType": null,
      "cardNumber": null,
      "cardUserType": null,
      "cardNum4Print": null,
      "cardBinNumber": null,
      "cashReceiptMgtKey": null,
      "accountBankCode": "092",
      "accountBankName": "토스뱅크",
      "accountNumber": "100******094",
      "msg": null,
      "errorCode": null
  }
}
4. 결제 환불하기
결제 건을 구매자에게 돌려줍니다.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/pay/refund-payment
요청 헤더

이름	타입	필수값 여부	설명
x-toss-user-key	string	Y	토스 로그인을 통해 획득한 userKey 값
요청 파라미터

이름	타입	필수	설명
payToken	String	Y	토스페이 토큰
reason	String	Y	환불 사유
한글 및 숫자, 영문자, 특수문자 _ - : . ^ @ ( ) [ ] # / ! % ? & 만 허용합니다.
isTestPayment	boolean	Y	payToken 이 샌드박스에서 발급된 것이면 true, 라이브앱에서 발급된 것이면 false
응답

이름	타입	설명
refundNo	String	환불 번호
approvalTime	String	결제건의 환불 처리 시간 (yyyy-MM-dd HH:mm:ss)
cashReceiptMgtKey	String	현금영수증 관리번호 식별
refundableAmount	Integer	환불 가능 금액
discountedAmount	Integer	할인된 금액
paidAmount	Integer	지불수단 승인금액
refundedAmount	Integer	환불요청 금액
refundedDiscountAmount	Integer	환불요청 금액 중 실 차감된 할인 금액
refundedPaidAmount	Integer	환불요청 금액 중 실 차감된 지불수단 금
payToken	String	환불된 결제토큰
transactionId	String	거래 트랜잭션 아이디
cardMethodType	String	카드 타입
- CREDIT : 신용카드
- CHECK : 체크카드
- PREPAYMENT : 선불카드
cardNumber	String	마스킹된 카드번호
cardUserType	String	카드 사용자 구분
- PERSONAL : 본인 카드
- PERSONAL_FAMILY : 가족카드
- CORP_PERSONAL : 법인지정 결제계좌 임직원
- CORP_PRIVATE : 법인 공용
- CORP_COMPANY : 법인지정 결제계좌 회사(하나카드만)
cardNum4Print	String	사용자가 선택한 카드의 끝 4자리
cardBinNumber	String	카드 BIN 넘버
accountBankCode	String	은행코드
사용자가 선택한 결제수단(payMethod)이 '토스머니'인 경우 토스가 정의한 은행 코드를 전달합니다.
accountBankName	String	은행 명
accountNumber	String	마스킹된 계좌번호

{
  "resultType": "SUCCESS",
  "success": {
    "refundNo": "string",
    "approvalTime": "string",
    "cashReceiptMgtKey": "string",
    "refundableAmount": 0,
    "discountedAmount": 0,
    "paidAmount": 0,
    "refundedAmount": 0,
    "refundedDiscountAmount": 0,
    "refundedPaidAmount": 0,
    "payToken": "string",
    "transactionId": "string",
    "cardMethodType": "string",
    "cardNumber": "string",
    "cardUserType": "string",
    "cardNum4Print": "string",
    "cardBinNumber": "string",
    "accountBankCode": "string",
    "accountBankName": "string",
    "accountNumber": "string"
  }
}
5. 결제 상태 조회하기
생성된 결제건의 거래 상태와 거래 트랜잭션을 조회할 수 있습니다.
상황에 따라, 승인 혹은 환불 응답을 수신하지 못한 경우에도 활용 가능합니다.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/pay/get-payment-status
요청 헤더

이름	타입	필수값 여부	설명
x-toss-user-key	string	Y	토스 로그인을 통해 획득한 userKey 값
요청 파라미터

이름	타입	필수	설명
payToken	String	Y	토스페이 토큰
orderNo	String	Y	가맹점 주문번호
isTestPayment	boolean	Y	payToken 이 샌드박스에서 발급된 것이면 true, 라이브앱에서 발급된 것이면 false
응답

이름	타입	설명
mode	String	결제환경
- LIVE : 실거래용
- TEST : 테스트용
payToken	String	토스페이 토큰
orderNo	String	토스페이와 연계된 상점 주문번호
payStatus	String	결제상태
payMethod	String	결제수단
- TOSS_MONEY : 토스머니
- CARD : 카드
amount	Integer	가맹점이 토스로 전달한 결제 총 금액
discountedAmount	Integer	할인된 금액
discountAmountV2	Integer	즉시 할인 적용 금액
paidPointV2	Integer	토스 포인트 사용금액
paidAmount	Integer	지불수단 승인금액
refundableAmount	Integer	환불 가능 잔액
amountTaxable	Integer	총 결제 금액 중 적용된 과세 금액
amountTaxFree	Integer	총 결제 금액 중 적용된 비과세 금액
amountVat	Integer	총 결제 금액 중 적용된 부가세 금액
amountServiceFee	Integer	총 결제 금액 중 적용된 봉사료
disposableCupDeposit	Integer	일회용 컵 보증금
accountBankCode	String	은행코드
accountBankName	String	은행명
accountNumber	String	마스킹된 계좌번호
card	Object	카드 정보
noInterest	Boolean	카드 무이자 적용 여부
- true : 무이자
- false : 일반
spreadOut	Integer	사용자가 선택한 카드 할부개월
cardAuthorizationNo	String	구매자가 확인할 수 있는 카드사 승인번호
cardMethodType	String	카드 타입
- CREDIT : 신용카드
- CHECK : 체크카드
- PREPAYMENT : 선불카드
cardUserType	String	카드 사용자 구분
- PERSONAL : 본인 카드
- PERSONAL_FAMILY : 가족카드
- CORP_PERSONAL : 법인지정 결제계좌 임직원
- CORP_PRIVATE : 법인 공용
- CORP_COMPANY : 법인지정 결제계좌 회사(하나카드만)
cardNumber	String	마스킹된 카드번호
cardBinNumber	String	카드 BIN 넘버
cardNum4Print	String	사용자가 선택한 카드의 끝 4자리
salesCheckLinkUrl	String	신용카드 매출전표 호출URL
cardCompanyName	String	승인 카드사명
cardCompanyCode	Integer	카드사 코드
transactions	list	거래 트랜잭션
stepType	String	요청된 거래 타입
- PAY : 결제
- REFUND : 환불
transactionId	String	거래 트랜잭션 아이디
결제의 거래구분을 위하여 유니크한 값을 생성하여 전달드립니다.
거래 대사 시, 이 값을 활용하시길 권장드립니다.
paidAmount	Integer	요청된 거래 타입(stepType) 중 적용된 지불수단 금액
transactionAmount	Integer	요청된 거래 타입(stepType)의 가맹점 전달금액
’환불’ 요청의 경우 -(마이너스) 금액이 리턴됩니다.
discountedAmount	Integer	요청된 거래 타입(stepType) 중 적용된 할인금액
할인 금액에는 토스 앱에서 자동 적용되는 즉시할인과 토스 포인트 사용금액이 포함됩니다.
pointAmount	Integer	요청된 거래 타입(stepType) 중 포인트 금액
regTs	String	요청 처리 시간
createdTs	String	결제 생성 시간
사용자 최초 결제 요청 시간
paidTs	String	결제 완료 처리 시간

{
  "resultType": "SUCCESS",
  "success": {
    "mode": "string",
    "payToken": "string",
    "orderNo": "string",
    "payStatus": "string",
    "payMethod": "string",
    "amount": 0,
    "discountedAmount": 0,
    "discountAmountV2": 0,
    "paidPointV2": 0,
    "paidAmount": 0,
    "refundableAmount": 0,
    "amountTaxable": 0,
    "amountTaxFree": 0,
    "amountVat": 0,
    "amountServiceFee": 0,
    "disposableCupDeposit": 0,
    "accountBankCode": "string",
    "accountBankName": "string",
    "accountNumber": "string",
    "card": {
      "noInterest": true,
      "spreadOut": 0,
      "cardAuthorizationNo": "string",
      "cardMethodType": "string",
      "cardUserType": "string",
      "cardNumber": "string",
      "cardBinNumber": "string",
      "cardNum4Print": "string",
      "salesCheckLinkUrl": "string",
      "cardCompanyName": "string",
      "cardCompanyCode": 0
    },
    "transactions": [
      {
        "stepType": "string",
        "transactionId": "string",
        "paidAmount": 0,
        "transactionAmount": 0,
        "discountedAmount": 0,
        "pointAmount": 0,
        "regTs": "string"
      }
    ],
    "createdTs": "string",
    "paidTs": "string"
  }
}
6. 코드 정리
결제상태 리스트
값	설명
PAY_STANDBY	결제 대기 중
PAY_APPROVED	구매자 인증 완료
PAY_CANCEL	결제 취소
PAY_PROGRESS	결제 진행 중
PAY_COMPLETE	결제 완료
REFUND_PROGRESS	환불 진행 중
REFUND_SUCCESS	환불 성공
SETTLEMENT_COMPLETE	정산 완료
SETTLEMENT_REFUND_COMPLETE	환불 정산 완료
은행코드 리스트
토스머니 결제의 경우 사용자가 선택한 계좌의 정보를 함께 전달합니다.

은행 코드 (accountBankCode)	은행 명 (accountBankName)
002	KDB산업은행
003	IBK기업은행
004	KB국민은행
005	KEB하나은행
007	수협은행
011	NH농협은행
020	우리은행
023	SC은행
027	씨티은행
031	대구은행
032	부산은행
034	광주은행
035	제주은행
037	전북은행
039	경남은행
045	MG새마을금고
048	신협
050	저축은행
064	산림조합
071	우체국
081	하나은행
088	신한은행
089	케이뱅크
090	카카오뱅크
092	토스뱅크
103	SBI저축은행
218	KB증권
230	미래에셋증권
238	미래에셋증권
240	삼성증권
243	한국투자증권
247	NH투자증권
261	교보증권
262	하이투자증권
263	현대차투자증권
264	키움증권
265	이베스트증권
266	SK증권
267	대신증권
269	한화투자증권
270	하나증권
271	토스증권
278	신한투자증권
279	DB금융투자
280	유진투자
287	메리츠증권
888	토스머니
889	토스포인트
카드사코드 리스트
카드사 이름	카드(매입사) 코드
신한	1
현대	2
삼성	3
국민	4
롯데	5
하나	6
우리	7
농협	8
씨티(미지원)	9
비씨(BC)	10
에러 코드
값	설명
PAYMENT_EXISTING_PAYMENT	이미 존재하는 결제입니다.
COMMON_INVALID_API_KEY	바르지 않은 apiKey 입니다.
COMMON_BREAK_TIME_OF_BANK	지금은 은행 점검 시간입니다. 점검이 끝난 후 사용해주세요.
그 외의 에러코드	
Pager
Previous page
QA 진행하기
토스페이 기능 개발을 마쳤다면 아래 항목을 꼼꼼히 점검해 주세요.

운영 팁

orderNo는 중복 불가합니다.
승인/환불 결과를 저장하고, transactionId 기준으로 대사하면 사고 대응이 빨라요.
항목	내용
기본 연동	미니앱 주문 금액과 토스페이 결제창 금액이 일치하는지 확인해주세요.
결제 인증 → 승인(실행) 흐름이 정상 동작하는지 확인해주세요.
결제 후 미니앱 화면에서 처리 결과가 일관되게 반영되는지 확인해주세요.
미니앱에서 결제 내역 조회가 가능한지 확인해주세요.
결제창 ‘취소’ 시 주문 화면으로 정상 복귀하는지 확인해주세요.
결제 실패 시 원인 메시지가 사용자에게 명확히 노출되는지 확인해주세요.
결제 취소/환불이 정상 처리되는지 확인해주세요.
타임아웃	결제 후 통신 장애/타임아웃으로 응답 미수신 시 망취소/실패 처리 등 대응이 준비되어 있는지 확인해주세요.
상태 조회	상태 조회 API로 승인/환불 결과를 대사 복구할 수 있는지 확인해주세요.
보안	mTLS 적용 및 키·토큰 보관(서버 전용) 정책을 준수하는지 확인해주세요.
Pager
Previous page
이해하기
앱인토스의 인앱 결제를 연동해 디지털 상품·권한·콘텐츠를 손쉽게 판매해 보세요.
구매 흐름을 짧게 하고 매출을 빠르게 늘릴 수 있어요.

인앱 결제가 무엇인가요?
인앱 결제는 앱 내부에서 유료 상품을 직접 구매할 수 있는 결제 방식이에요.
사용자가 앱을 떠나지 않고도 필요한 기능, 아이템, 콘텐츠 등을 바로 결제할 수 있어요.
인앱 결제의 상품은 소모성과 비소모성으로 나뉘어요.

소모성 아이템: 사용하면 사라지며, 계속 사용하려면 다시 구매해야 해요.
비소모성 아이템: 한 번 구입하면 계속 사용할 수 있어요.


인앱 결제를 사용하면 무엇이 좋나요?
사용자가 앱을 벗어나지 않고 필요한 상품을 바로 구매할 수 있기 때문에 이탈을 방지할 수 있어요.
출시 초기부터 바로 유료 아이템, 구독 상품을 판매해 수익을 만들 수 있어요.
소모성 아이템, 비소모성 아이템으로 다양한 상품을 활용하여 매출을 극대화할 수 있어요.
참고해 주세요
인앱 결제의 환불은 Apple과 Google 정책에 따르고 있어요.
판매가는 공급가에 VAT가 더해진 금액이에요.
결제 진행 시 앱 내 기능(음악, 영상 등)은 잠시 멈추고 완료 후 자동 복귀하도록 해주세요.
Pager
Previous page
QA 진행하기
Next page
콘솔 가이드
인앱결제를 진행하기 위해서는 다음과 같은 준비가 필요해요.

대표 관리자의 인앱결제에 대한 약관 동의
KYC 진행 및 검토 (영업일 기준 3~4일 소요)
토스 로그인 기능 연동 필요


1. 약관 동의
인앱 상품 등록을 위해서는 약관 동의가 필요해요.

약관 동의는 앱인토스 콘솔에서 진행할 수 있으며, 대표 관리자로 지정된 분의 계정에서만 가능해요.

약관 동의 방법
앱인토스 콘솔 접속 → 대표 관리자 계정 로그인 → 워크스페이스 선택 → 미니앱 선택 → 좌측 메뉴 중 ‘인앱결제’ 선택 후 ‘약관 확인하기’를 클릭하여 아래 화면에서 약관 동의 진행


2. KYC 진행하기
인앱결제 사용을 하시는 경우 특정금융정보법에 따라 본인확인제도(Know Your Customer) 절차가 필수로 필요해요.
‘+ 등록하기’ 를 눌러서 안내에 따라 작성 후 검토를 요청하면, 영업일 기준 3~4일 내에 승인되고 이후에 상품을 등록할 수 있어요.

3. 상품 등록하기
KYC 검토가 모두 완료된 이후 + 등록하기 로 인앱결제 상품을 등록해 주세요.



상품 등록 시 사용자에게 정확한 구매 정보를 전달하고 원활한 운영을 위해 아래의 내용을 준수하여 입력해 주세요.
가이드에 맞지 않을 경우 반려될 수 있어요.

상품 유형
소모품 : 사용하면 소진이 되는 품목으로 다시 사용하려면 재구매가 필요해요. (예: 게임 아이템, 내부 재화 충전, 1회 이용권 등)
비소모품 : 한 번 구매하면 영구적으로 사용할 수 있어요. (예: 광고 제거, 소장형 콘텐츠 등)
단, 현금성/환가성/토스 포인트를 결합해서 제공하는 상품은 판매할 수 없어요.
상품명
사용자가 얻게 되는 기능·조건과 일치해야 해요.
과장하거나 기만하는 표현을 쓰면 안 돼요. (예: 제공 기간이 있음에도 “무제한”)
상품 설명 (유저 미노출 영역)
상품의 제공 조건(시점, 기간, 횟수)을 정확히 적어야 해요.
상품의 제공 범위(예: 광고 제거의 경우 어떤 광고가 제거되는지)를 명확히 표시해야 해요.
상품 사용 시 유저가 얻게 되는 효용을 설명해야 해요.
공급가
VAT가 제외된 공급 기준 금액이에요.
최소 400원 ~ 최대 1,400,000원까지 설정할 수 있어요.
10원 단위로만 입력이 가능해요.
공급가를 입력하면 판매가는 자동으로 설정돼요.
반대로 판매가 입력 시 공급가가 설정 되는 것은 현재 지원하지 않아요.
판매가
사용자가 앱에서 실제로 결제하는 최종 금액이며, 공급가에 VAT가 더해진 가격이에요.
상품 이미지
상품 식별을 위한 텍스트(“30일 이용권”, “100코인”)를 넣을 수 있어요.
광고성·이벤트성 문구를 사용할 경우, 이벤트 진행 기간을 함께 표시해야 해요.
해상도는 1024×1024px로 등록해야 해요.
저작권 문제가 없는 이미지만 사용해야 해요. (파트너사에서 확보해야 해요.)
그 외 선정적이거나 폭력적이거나 불쾌감을 주는 등의 이미지는 사용할 수 없어요.
노출 여부
심사 승인 후 바로 상품을 노출하려면 체크박스를 선택해주세요. 선택하지 않아도 나중에 직접 노출을 시작할 수 있어요.
상품 정보를 모두 입력했다면 검토 요청하기 버튼을 눌러 주세요.
검토는 영업일 기준 2일 정도 소요되며, 완료되면 등록한 인앱결제 상품을 사용할 수 있어요.
이후 해당 상품을 기준으로 주문 내역과 정산 내역을 확인할 수 있어요.



4. 환불하기
애플과 구글의 환불 정책

애플

모든 환불은 Apple이 직접 판단/승인해요(파트너사 권한 없음).
애플은 환불 요청 자체가 불가하며, 결제 상태 조회 API만 제공돼요.
구글

사용자가 토스 앱에서 직접 환불 요청을 할 수 있고, 파트너사에서는 앱인토스 콘솔에서 환불 신청 내역을 확인 후 처리할 수 있어요.
단, 최송 승인 및 거절은 구글이 결정해요.
인앱결제로 결제한 사용자는 토스 앱에서 ‘환불받기’ 버튼으로 사유를 선택해 환불을 요청할 수 있어요.

파트너사는 앱인토스 콘솔에서 환불 내역에서 요청을 승인/반려할 수 있습니다.

토스 앱에서 환불받기 접속 방법
토스 앱 → 오른쪽 아래 ‘전체’ 또는 ‘찾기’ → ‘게임’ 선택 → 상단의 게임 프로필 ‘닉네임’ 선택 → 구매 내역 → 환불 원하는 결제 내역 선택 → ‘환불받기’ 선택 후 접수
[안드로이드 환불 방법]
환불 방법 관련 (안드로이드).png

[iOS 환불 방법]
환불 방법 관련 (iOS).png

안드로이드 OS 사용자가 앱에서 환불 요청을 한 경우 아래 화면과 같이 요청 내역을 앱인토스 콘솔에서 확인할 수 있어요.

결과 사용자에게 푸시 알림으로 발송되며, 사용자 주문 상세에서도 확인돼요.
파트너사 또는 Google Play가 환불 거절한 경우에도 알림이 발송돼요.
iOS 사용자의 경우 환불은 애플에 권한이 있기 때문에 결제 조회만 가능해요.

[인앱결제 - 결제 내역]
유저가 미니앱에서 결제한 상품 내역이에요.



[인앱결제 환불 내역 - 환불 요청]
유저가 환불을 요청한 내역이에요. 환불 요청사유를 확인하고 요청 반려 및 **요청 승인**을 할 수 있어요.



[인앱결제 환불 내역 - 요청 승인]
파트너사가 환불 요청을 승인한 내역이에요. 요청을 승인하면, 앱마켓에 심사가 요청돼요.

앱마켓에서



[인앱결제 환불 내역 - 환불 반려]
파트너사가 환불 요청을 반려하건, 앱마켓에서 환불을 반려한 내역이에요.



[인앱결제 환불 내역 - 환불 완료]
앱마켓에서 환불이 완료된 내역이에요.



자주 묻는 질문
Q. 인앱결제 수수료는 어떻게 되나요?
인앱결제 수수료는 앱마켓 수수료 15% (향후 매출에 따라 변동 가능) + 토스 수수료 5%가 적용돼요. 자세한 내용은 정산 이해하기 메뉴의 ‘인앱결제’ 항목을 확인해 주세요.
Q. 인앱결제 테스트를 하고 싶어요.
인앱결제 테스트 환경은 추후 제공이 될 예정이에요. 제공될 경우 콘솔 및 개발자 커뮤니티의 ‘공지 사항’ 을 통해 안내해 드릴게요.
Q. 사용자가 환불을 희망할 경우 어떻게 해야 하나요?
iOS 사용자의 경우 애플 고객센터로 안내해 주세요. (애플에 모든 권한이 있어요.)
안드로이드 사용자의 경우 가이드처럼 토스 앱 내에서 환불 신청을 할 수 있게 안내해 주세요.
Pager
Previous page
이해하기
Next page
개발하기
주의하세요

SDK 1.1.3 버전 이상을 사용해주세요.
SDK 1.1.3 버전부터는 상품 지급 완료 과정이 추가되어 함수 인터페이스가 변경되었어요.
SDK 1.2.2 버전부터는 구매 복원 기능이 추가되었어요.
사용자의 기기가 변경되더라도 인앱결제 상품이 지급 유지될 수 있도록 반드시 연동해주세요.
네이티브 저장소 기능을 활용해 주세요.
토스 로그인 연동과 인앱결제 상태 조회 API를 활용해 주세요.
인앱결제 상태 조회 API 사용을 위해서는 사전에 필히 토스 로그인 연동을 진행해 주세요.



BaseURL

https://apps-in-toss-api.toss.im

1. 상품 목록 가져오기
SDK를 통해 연동해 주세요.

콘솔에 등록한 인앱결제 상품 목록을 가져와요.
가져온 상품 목록은 화면에 표시할 때 사용해요.

자세한 내용은 IapProductListItem 페이지를 확인해 주세요.

참고하세요

샌드박스에서는 실제 등록/승인된 상품이 아닌, 테스트 상품 - 1, 테스트 상품 - 2 와 같은 mock 데이터가 노출돼요.
토스앱 내에서 동작할 때는 승인된 실제 상품 목록이 정상적으로 보여져요.

2. 인앱결제 요청하기
SDK를 통해 연동해 주세요.

인앱결제 결제창을 띄우고, 사용자가 결제를 진행해요.
결제 완료 후 앱인토스 서버가 실제 결제 여부를 검증하며, 구글/애플 영수증까지 확인해요.
만약 결제 중에 에러가 발생하면 에러 유형에 따라 에러 페이지로 이동해요.

SDK 1.1.3 버전부터는 결제 성공 시 파트너사 상품 지급 로직이 실행돼요
파트너사 상품 지급 로직이 정상적으로 완료되면 콜백(event.type: success)이 전달돼요.
지급 실패 시에는 PRODUCT_NOT_GRANTED_BY_PARTNER 오류 코드가 전달돼요. (토스앱 5.230.0 이상 지원)

자세한 내용은 createOneTimePurchaseOrder 페이지를 확인해주세요.

주의하세요

환불 권한은 앱마켓에 있어요.
앱마켓 환불 요청 및 승인 여부는 앱인토스에서 보장할 수 없으므로,테스트는 반드시 소액으로 진행해 주세요.

SDK 1.1.3 버전부터는 지급 완료 과정이 추가되었어요.
함수 인터페이스가 변경되어, SDK 업데이트 시 꼭 코드 수정을 해주세요.

3. 주문 복원하기
SDK를 통해 연동해 주세요.

미결 주문을 조회하여 사용자에게 상품을 지급하고, 해당 주문의 상태를 업데이트합니다.

getPendingOrders

결제는 완료되었지만 상품이 아직 지급되지 않은 주문 목록을 조회해요.
조회된 주문의 orderId를 확인하여 사용자에게 상품을 지급하세요.
completeProductGrant

대기 중인 주문의 상품 지급을 완료 처리합니다.
사용자에게 상품을 지급한 뒤, completeProductGrant 를 호출하여 지급 상태를 완료로 변경하세요.
앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

자세한 내용은 getPendingOrders 및 completeProductGrant 페이지를 확인해주세요.

4. 주문 조회하기
결제 및 상품 지급이 완료된 주문, 또는 환불된 주문의 상태를 조회할 수 있어요.
SDK와 API 두 가지 방식 중 상황에 맞게 선택해 사용해 주세요.

SDK로 조회하기
getCompletedOrRefundedOrders 는 인앱결제로 구매한 뒤 결제 및 지급이 완료된 주문과 환불된 주문 목록을 조회해요.
결제는 완료되었지만 상품이 지급되지 않은 주문은 조회되지 않아요.

앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

자세한 내용은 getCompletedOrRefundedOrders 페이지를 확인해주세요.

API로 조회하기
API를 통해 서버에서 인앱결제 주문 상태를 직접 조회할 수 있어요.
승인 혹은 환불 응답을 받지 못한 경우에도 사용할 수 있어요.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/order/get-order-status
참고하세요

결제 상태 조회 API 사용을 위해서는 토스 로그인 연동을 먼저 진행해 주세요.

요청 헤더

이름	타입	필수값 여부	설명
x-toss-user-key	string	Y	토스 로그인을 통해 획득한 userKey 값
요청 파라미터

이름	타입	필수	설명
orderId	String	Y	결제 생성 후 취득한 주문번호(uuid v7)

{
    "orderId": "13c9a1ff-2baa-4495-bbfa-a0826ba8c7c0"
}
응답

이름	타입	설명
orderId	String	요청한 주문번호
sku	String	주문한 상품 ID
statusDeterminedAt	String	주문 완료 일시 (yyyy-MM-dd'T'HH:mm:ssZ)
status	String	주문에 대한 상태 (enum)
reason	String	상태에 대한 설명
status (enum)

상태	설명	상세 설명
PAYMENT_COMPLETED	결제 및 상품 지급 완료	SDK 1.1.3 이상에서 인앱 결제와 상품 지급이 모두 완료된 경우
PURCHASED	구매 완료	SDK 1.1.2 이하에서 인앱 결제가 성공한 경우
ORDER_IN_PROGRESS	주문 진행 중	주문이 생성되었지만 결제/지급 처리가 완료되지 않은 경우
FAILED	주문 실패	결제 실패 또는 상품 지급 실패
REFUNDED	주문 환불됨	환불 완료된 경우
NOT_FOUND	주문 없음	해당 주문번호를 찾을 수 없는 경우
MINIAPP_MISMATCH	상품 불일치	주문한 상품이 해당 앱의 상품이 아닌 경우
ERROR	내부 오류	시스템 내부 상태 이상

{
    "resultType": "SUCCESS",
    "success": {
        "orderId": "13c9a1ff-2baa-4495-bbfa-a0826ba8c7c0",
        "sku":"ait.0000010000.af647449.3bd55cfd00.0000000475",
        "statusDeterminedAt":"2025-09-12T16:57:12",
        "status": "PAYMENT_COMPLETED",
        "reason": "결제가 완료되었어요."
    }
}
자주 묻는 질문

샌드박스에서 콘솔에서 등록한 상품이 보이지 않아요.




인앱 결제 실패 시 "orderId" 프로퍼티가 내려오지 않아요.



인앱 결제 실패 시 "errorCode" 프로퍼티가 내려오지 않아요.



주문 실패 건이 발생하면 어떻게 처리해야 하나요?




토스앱에서 인앱 결제 구매내역은 어떻게 확인하나요?

Pager
Previous page
콘솔 가이드
Next page
QA 진행하기
인앱결제 연동을 마쳤다면 아래 항목을 꼼꼼히 점검해 주세요.

운영 팁

주문 키(orderId)는 단건-단결제 원칙으로 운영하고, 모든 처리 결과를 서버에 영구 저장하세요.
비소모품(권한/광고 제거) 은 반드시 복원(restore) 경로를 제공하세요.
재요청·중복 클릭에 대비해 멱등성(idempotency) 을 고려한 설계가 좋아요.
항목	내용
기본 연동	미니앱 주문 금액과 스토어 결제창 금액이 일치하는지 확인해주세요.
인앱결제가 정상 진행되는지 확인해주세요.
결제 후 미니앱 화면/서버가 동일한 결과로 처리하는지 확인해주세요.
주문 내역 조회(영수증 검증 완료 기준) 가 가능한지 확인해주세요.
스토어 결제창 ‘취소’ 시 주문 화면으로 정상 복귀하는지 확인해주세요.
실패 시 원인 메시지가 사용자에게 명확히 노출되는지 확인해주세요.
결제 취소/환불 안내 흐름이 준비되어 있는지 확인해주세요.
데이터/권한	비소모품 재설치/기기변경 시 복원 흐름이 준비되어 있는지 확인해주세요.
중복 구매/중복 지급 방지 로직이 있는지 확인해주세요.
안정성	네트워크 장애/타임아웃 시 재시도·대체 흐름이 있는지 확인해주세요.
앱 재시작/백그라운드 복귀 시 상태 일관성이 유지되는지 확인해주세요.
최소 지원 버전 미만에서는 해당 상품이 노출/결제되지 않는지 확인해주세요.
Pager
Previous page
개발하기
Next page
