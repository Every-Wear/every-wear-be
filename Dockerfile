FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install

# # 다양한 scripts 필요시 될 수 있다.
# COPY ./scripts /scripts
# ENV PATH ${PATH}:/scripts

# 컨테이너에서 실행될 명령을 지정
CMD ["yarn", "start"]
