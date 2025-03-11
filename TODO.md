Tickers DELETE bug

- When deleting a tag, the ticker is not deleted
- When deleting a ticker, the tag is not deleted

Questions:

1. Company name not populating
2. Remove Price
3. Remove Market Cap
4. Set up persistent updates on F/E and B/E for tag details

5. Send request to api route to trigger api GET from SEC
6. Receive parsed data and send to Grok LLM API end point with prompts.
7. Response is stored in Mongoose, formatted into a high fidelity email, and then sent to the user's email address.

8. Add a "resend summary" button to the ticker details page.
9. Add a "delete ticker" button to the ticker details page.
