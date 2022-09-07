module.exports = {
    apps: [
        {
            name: 'bether',
            script: 'npm',
            args: 'develop',
            env: {
                NODE_ENV: 'development',
            },
            exp_backoff_restart_delay: 100,
        },
    ],
};