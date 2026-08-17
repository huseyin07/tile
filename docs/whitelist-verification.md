# TILE whitelist verification

- Wallet addresses are validated as EVM addresses and duplicate wallets are rejected.
- X usernames are validated and duplicate X accounts are rejected.
- The final submitted X status URL must belong to the same X username used in the application.
- Reusing an X post across applications is rejected.
- When X API verification is configured, the final signal post content is verified by the API; otherwise ownership is verified from the normalized status URL.
- Follow, like, repost and tag tasks remain participant-confirmed unless user-authorized X API access is configured.
- Admins can review verification state and manually whitelist or reject verified applications.
