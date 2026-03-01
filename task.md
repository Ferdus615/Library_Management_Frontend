

similar to the reservation & loans history create a fines page under the History page

this is the api endpoint
http://localhost:3000/user/fines/{user_id}

this is the respose you will receive
[
    {
        "id": "246929a6-8481-4a2f-9599-186e1cd0e29b",
        "user": {
            "id": "ccb3c10f-d36e-4f1a-9f1d-a3958191b92d",
            "first_name": "Bob",
            "last_name": "Williams",
            "email": "bob.williams@example.com"
        },
        "loan": {
            "id": "38286f9e-62b7-4374-b318-45bdf2630b45",
            "status": "overdue",
            "issue_date": "2026-02-05",
            "due_date": "2026-02-05",
            "return_date": null
        },
        "book_title": "Introduction to Algorithms 2nd edition",
        "total_amount": 230,
        "paid": true,
        "paid_at": "2026-02-25T13:06:34.198Z"
    },
    {
        "id": "10fad9f5-4a29-4ea4-8fb4-040209f46e4d",
        "user": {
            "id": "ccb3c10f-d36e-4f1a-9f1d-a3958191b92d",
            "first_name": "Bob",
            "last_name": "Williams",
            "email": "bob.williams@example.com"
        },
        "loan": {
            "id": "53feb71e-f61c-4bfb-9bb6-62a91accf969",
            "status": "returned",
            "issue_date": "2025-12-30",
            "due_date": "2025-12-31",
            "return_date": "2026-02-05"
        },
        "book_title": "Design Patterns: Elements of Reusable Object-Oriented Software",
        "total_amount": 360,
        "paid": false,
        "paid_at": null
    }
]