module.exports = {
    apps: [
        {
            name: "everywear-be",
            script: "yarn",
            interpreter: "sh", // Shell 스크립트의 인터프리터 지정
            args: "start",
            watch: true,
            watch_options: {
                usePolling: true,
                interval: 1000, // 변경 감지 주기를 1초로 설정
            },
        },
    ],
};