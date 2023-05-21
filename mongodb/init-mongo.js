db.createUser({
    user: "every-wear-mongo",
    pwd: "every-wear-mongo!",
    roles: [
        {
            role: "admin",
            db: "every_wear_data"
        }
    ]
});
