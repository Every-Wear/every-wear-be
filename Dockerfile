FROM node:18-alpine

WORKDIR /app

COPY . .

# pm2 install
RUN apk --no-cache add yarn \
    && yarn install \
    && yarn global add pm2

# # 다양한 scripts 필요시 될 수 있다.
# COPY ./scripts /scripts
# ENV PATH ${PATH}:/scripts

# 컨테이너에서 실행될 명령을 지정
# CMD ["yarn", "start"]

ENV PATH="/app/node_modules/.bin:$PATH"

# CMD ["pm2-runtime", "start", "yarn", "--name", "everywear-be", "--watch", "--", "start"]
CMD ["pm2-runtime", "start", "--restart-delay", "2000", "--interpreter", "sh", "yarn", "--name", "everywear-be", "--watch", "--", "start"]
