---
'@mastra/server': patch
---

Fixed authenticated memory API reads so requests without a resource scope cannot enumerate or read resource-owned threads unless FGA is configured.
