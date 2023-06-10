#!/bin/bash

# crontab 등록, SLACK_TOKEN 환경 변수 세팅 먼저 필요
# */5 * * * * /home/ubuntu/every-wear-be/src/batch/healthChecker.sh >> /home/ubuntu/crontab-log.log

urls=("https://localhost/api/ping" "https://everywear.kro.kr/")
for url in "${urls[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [[ $response == "200" ]]; then
        echo "$(date): $url is healthy."
    else
        echo "$(date): $url is down (HTTP response: $response)."
        curl --request POST \
        --url https://slack.com/api/chat.postMessage \
        --header "Authorization: Bearer $SLACK_TOKEN" \
        --header "Content-Type: application/json" \
        --data '{
            "text":"<@U034N5TBUSZ> '$url' 의 서버 상태가 정상이 아닙니다!! sudo ssh -i ~/.ssh/every-wear.key ubuntu@146.56.119.132 / fe:158.180.92.143, <'$url'|여기를 클릭>",
            "channel": "C034R2SQRDY"
        }'
    fi
done