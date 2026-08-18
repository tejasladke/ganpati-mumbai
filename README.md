<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0a41b4f4-71d8-4694-84b2-813213ecec1a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Pandal Partner + Private Chat

This version adds a community feature at **Find Partner**:
- visit-plan based partner matching
- connection requests
- accepted-connection private chat
- Socket.IO real-time messages and typing indicator
- notifications
- shared pandal visit plans
- block/report endpoints

### Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Notes

The existing project currently uses its in-memory `store` for application data even when `MONGODB_URI` is configured. The new community feature follows that same architecture so it works immediately without changing your existing database design. Restarting the server clears newly created community data. For production persistence, the community collections should be moved to Mongoose models.


## Location data note
The directory keeps real pandal coordinates only when a reliable public source or the existing project data provides a location. It does not generate fake coordinates just to reach an arbitrary count. The search now includes railway/metro stations (including Panvel Railway Station) and sorts nearby pandals by distance. This architecture can safely grow to 1,000+ verified mandals as a CSV/API feed is added.
