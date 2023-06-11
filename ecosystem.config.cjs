module.exports = {
    apps: [
        {
            name: "everywear-be",
            script: "./www/www.js",
            interpreter: "sh", // Shell 스크립트의 인터프리터 지정
            instances: "max", // match the number of CPUs on the machine
            exec_mode: "cluster", // Run multiple child processes
            args: "start",
            watch: true,
            watch_options: {
                usePolling: true,
                interval: 1000, // 변경 감지 주기를 1초로 설정
            },
            ignore_watch: ["logs", "tmp", "public", "static"], // 감시에서 제외할 파일 또는 디렉토리 패턴
        },
    ],
};