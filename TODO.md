Tickers DELETE bug

- When deleting a tag, the ticker is not deleted
- When deleting a ticker, the tag is not deleted

Questions:

1. Is a TrackedTicker.ts model necessary?
2. Can't I just query the User model for 'subscribedTickers'?
3. If multiple users are subscribed to the same ticker, how do I know which one to delete?
4. How do I store the tags?
5. How do I store the ticker search results?
6. How do I store the ticker details?
7. How do I store the ticker news?
8. How do I store the ticker events?
9. How do I store the ticker earnings?
