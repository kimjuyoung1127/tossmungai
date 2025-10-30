AccessToken 재발급 받기
Refresh Token으로 Access Token을 다시 발급받는 API예요.

Request Body
Schema
JSON

{
"refreshToken": 
"1//0gdfg23rF9sds..."
}
Responses
200
400
요청에 성공해서 재발급된 Access Token 관련 정보가 돌아와요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"accessToken": 
"ya29.A0ARrdaM9bZxZJ...",
"refreshToken": 
"1//0gdfg23rF9sds...",
"expiresIn": 
3600,
"tokenType": 
"Bearer",
"scope": 
"profile message:send"
}
}

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
  AccessToken 받기
Authorization Code로 Access Token과 Refresh Token을 발급하는 API예요.

Request Body
Schema
JSON

{
"authorizationCode": 
"SplxlOBeZQQYbYS6WxSbIA",
"referrer": 
"deeplink"
}
Responses
200
400
요청에 성공해서 발급된 토큰 정보가 돌아와요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"accessToken": 
"ya29.A0ARrdaM9bZxZJ...",
"refreshToken": 
"1//0gdfg23rF9sds...",
"expiresIn": 
3600,
"tokenType": 
"Bearer",
"scope": 
"profile message:send"
}
}

POST
/api-partner/v1/apps-in-toss/user/oauth2/generate-token
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
Pager
Previous page
POST
AccessToken 재발급 받기
Next page
POST
userKey로 로그인 연결 끊기AccessToken 재발급 받기
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"accessToken": 
"ya29.A0ARrdaM9bZxZJ...",
"refreshToken": 
"1//0gdfg23rF9sds...",
"expiresIn": 
3600,
"tokenType": 
"Bearer",
"scope": 
"profile message:send"
}
}

POST
/api-partner/v1/apps-in-toss/user/oauth2/refresh-token
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/refresh-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
Pager
Previous page
시작하기
Next page
POSAccessToken 받기
Authorization Code로 Access Token과 Refresh Token을 발급하는 API예요.

Request Body
Schema
JSON

{
"authorizationCode": 
"SplxlOBeZQQYbYS6WxSbIA",
"referrer": 
"deeplink"
}
Responses
200
400
요청에 성공해서 발급된 토큰 정보가 돌아와요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"accessToken": 
"ya29.A0ARrdaM9bZxZJ...",
"refreshToken": 
"1//0gdfg23rF9sds...",
"expiresIn": 
3600,
"tokenType": 
"Bearer",
"scope": 
"profile message:send"
}
}

POST
/api-partner/v1/apps-in-toss/user/oauth2/generate-token
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
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

{
"userKey": 
123456789
}
Responses
200
400
요청에 성공해서 `userKey`를 기반으로 연결이 해제된 사용자의 `userKey`가 돌아와요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"userKey": 
123456789
}
}

POST
/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})AccessToken 으로 로그인 연결 끊기
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"userKey": 
123456789
}
}

POST
/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ya29.A0ARrdaM9bZxZJ...',
    'Content-Type': 'application/json'
  }
})
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"userKey": 
123456789,
"scope": 
"profile message:send",
"agreedTerms": 
[
[
"tos_terms_1",
"privacy_policy"
]
],
"name": 
"홍길동",
"callingCode": 
"82",
"phone": 
"1012345678",
"birthday": 
"19900101",
"ci": 
"aaf7cb53...",
"di": 
"b712df83...",
"gender": 
"M",
"nationality": 
"KR",
"email": 
"user@example.com"
}
}

GET
/api-partner/v1/apps-in-toss/user/oauth2/login-me
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me', {
  headers: {
    Authorization: 'Bearer ya29.A0ARrdaM9bZxZJ...',
    'Content-Type': 'application/json'
  }
})
Pager
Previous page
POST
AccessToken 으로 로그인 연결 끊기
Next page
POST
프로모션 토스프로모션 토스포인트 지급 결과 조회하기
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

{
"promotionCode": 
"string",
"key": 
"string"
}
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
"string"
}

POST
/api-partner/v1/apps-in-toss/promotion/execution-result
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execution-result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
GET
사용자 정보 받기
Next page
POST
프로모션 리프로모션 리워드 지급하기
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

{
"promotionCode": 
"string",
"key": 
"string",
"amount": 
0
}
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"key": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/promotion/execute-promotion
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"key": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/promotion/execute-promotion/get-key
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion/get-key', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})제 환불하기
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

{
"payToken": 
"string",
"reason": 
"string",
"isTestPayment": 
true
}
Responses
200
400
환불 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"refundNo": 
"string",
"approvalTime": 
"string",
"cashReceiptMgtKey": 
"string",
"refundableAmount": 
0,
"discountedAmount": 
0,
"paidAmount": 
0,
"refundedAmount": 
0,
"refundedDiscountAmount": 
0,
"refundedPaidAmount": 
0,
"payToken": 
"string",
"transactionId": 
"string",
"cardMethodType": 
"string",
"cardNumber": 
"string",
"cardUserType": 
"string",
"cardBinNumber": 
"string",
"cardNum4Print": 
"string",
"accountBankCode": 
"string",
"accountBankName": 
"string",
"accountNumber": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/pay/refund-payment
Samples

cURL

JavaScript

PHP

Python

fetch('https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/refund-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
POST
프로모션 리워드 지급 키 생성하기
Next page
P결제 생성하기
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

{
"orderNo": 
"20250422-01",
"productDesc": 
"테스트결제",
"amount": 
0,
"amountTaxFree": 
0,
"amountTaxable": 
0,
"amountVat": 
0,
"amountServiceFee": 
0,
"enablePayMethods": 
"string",
"cashReceipt": 
true,
"cashReceiptTradeOption": 
"string",
"installment": 
"string",
"isTestPayment": 
true
}
Responses
200
400
결제 생성 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"payToken": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/pay/make-payment
Samples

cURL

JavaScript

PHP

Python

fetch('https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/make-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
POST
결제 환불하기
Next page
POST
결제 상태 조회하기결제 상태 조회하기
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

{
"payToken": 
"pay-abc123",
"orderNo": 
"ORDER_20250407",
"isTestPayment": 
false
}
Responses
200
404
결제 상태 정보가 반환돼요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"mode": 
"NORMAL",
"payToken": 
"pay-abc123",
"orderNo": 
"ORDER_20250407",
"payStatus": 
"DONE",
"payMethod": 
"CARD",
"amount": 
15000,
"discountedAmount": 
12000,
"discountAmountV2": 
3000,
"paidPointV2": 
2000,
"paidAmount": 
10000,
"refundableAmount": 
8000,
"amountTaxable": 
10000,
"amountTaxFree": 
0,
"amountVat": 
1000,
"amountServiceFee": 
0,
"disposableCupDeposit": 
500,
"accountBankCode": 
"88",
"accountBankName": 
"신한은행",
"accountNumber": 
"110123456789",
"card": 
{
"noInterest": 
false,
"spreadOut": 
3,
"cardAuthorizationNo": 
"A123456789",
"cardMethodType": 
"SINGLE",
"cardUserType": 
"PERSONAL",
"cardNumber": 
"1234567890123456",
"cardBinNumber": 
"123456",
"cardNum4Print": 
"123456******3456",
"salesCheckLinkUrl": 
"https://pay.toss.im/receipt/abc123",
"cardCompanyName": 
"현대카드",
"cardCompanyCode": 
25
},
"transactions": 
[
{
"stepType": 
"PAID",
"transactionId": 
"txn_abc123",
"paidAmount": 
10000,
"transactionAmount": 
12000,
"discountedAmount": 
2000,
"pointAmount": 
0,
"regTs": 
"2025-04-07T13:12:05Z"
}
],
"createdTs": 
"2025-04-07T13:12:00Z",
"paidTs": 
"2025-04-07T13:12:05Z"
}
}

POST
/api-partner/v1/apps-in-toss/pay/get-payment-status
Samples

cURL

JavaScript

PHP

Python

fetch('https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/get-payment-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
POST
결제 생성하기
Next page
POST
결결제 실행하기
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

{
"payToken": 
"string",
"orderNo": 
"20250422-01",
"isTestPayment": 
true
}
Responses
200
400
결제 승인 요청이 성공적으로 처리됐어요.
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"code": 
0,
"mode": 
"string",
"orderNo": 
"string",
"amount": 
0,
"approvalTime": 
"string",
"stateMsg": 
"string",
"discountedAmount": 
0,
"paidAmount": 
0,
"payMethod": 
"string",
"payToken": 
"string",
"transactionId": 
"string",
"cardCompanyCode": 
0,
"cardCompanyName": 
"string",
"cardAuthorizationNo": 
"string",
"spreadOut": 
0,
"noInterest": 
true,
"salesCheckLinkUrl": 
"string",
"cardMethodType": 
"string",
"cardNumber": 
"string",
"cardUserType": 
"string",
"cardNum4Print": 
"string",
"cardBinNumber": 
"string",
"cashReceiptMgtKey": 
"string",
"accountBankCode": 
"string",
"accountBankName": 
"string",
"accountNumber": 
"string",
"msg": 
"string",
"errorCode": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/pay/execute-payment
Samples

cURL

JavaScript

PHP

Python

fetch('https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/execute-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
POST
결제 상태 조회하기
Next page
POST
결제 상태 조회하기결제 상태 조회하기
생성된 결제건의 거래 상태와 거래 트랜잭션을 조회할 수 있습니다. 상황에 따라, 승인 응답을 수신하지 못한 경우에도 활용 가능합니다.

Request Body
Schema
JSON

{
"orderId": 
"string"
}
Responses
200
인앱 결제 상태 조회에 성공했어요
Content-Type
application/json
Schema
JSON

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"orderId": 
"string",
"sku": 
"string",
"status": 
"string",
"statusDeterminedAt": 
"string",
"reason": 
"string"
}
}

POST
/api-partner/v1/apps-in-toss/order/get-order-status
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/order/get-order-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
Pager
Previous page
POST
결제 실행하기
Next page
POST
메시지 발송하기메시지 발송하기
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

{
"templateSetCode": 
"ALERT_OTP_TEMPLATE",
"context": 
{
"additionalProperties": 
{
}
}
}
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

{
"resultType": 
"string",
"error": 
{
"errorType": 
0,
"errorCode": 
"string",
"reason": 
"string",
"data": 
{
"additionalProperties": 
{
}
},
"title": 
"string"
},
"success": 
{
"msgCount": 
5,
"sentPushCount": 
2,
"sentInboxCount": 
1,
"sentSmsCount": 
1,
"sentAlimtalkCount": 
0,
"sentFriendtalkCount": 
1,
"detail": 
{
"sentPush": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentInbox": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentSms": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentAlimtalk": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentFriendtalk": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
]
},
"fail": 
{
"sentPush": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentInbox": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentSms": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentAlimtalk": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
],
"sentFriendtalk": 
[
{
"contentId": 
"MSG_ABC123",
"reachedFailReason": 
"푸시 수신 거부 상태입니다."
}
]
}
}
}

POST
/api-partner/v1/apps-in-toss/messenger/send-message
Samples

cURL

JavaScript

PHP

Python

fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/messenger/send-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Toss-User-Key': 'toss-user-key-abc123'
  }
})
Pager
Previous page
POST
결제 상태 조회하기
