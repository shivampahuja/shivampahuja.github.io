# Nitya weds Anuj

Wedding invitation site, served by GitHub Pages at
https://shivampahuja.github.io/nitya-weds-anuj/

- `index.html` is the invitation (a self-contained export from Claude Design, with the images embedded)
- `og.jpg` is the link-preview image shown by WhatsApp and others
- `rsvp/Code.gs` is the optional Google Apps Script that receives RSVPs and appends them to the AN Google Sheet
- `tools/build.py` rebuilds `index.html` from a fresh export, setting the title, link-preview tags and the RSVP endpoint:

```
python3 tools/build.py export.html index.html --endpoint <RSVP endpoint URL> --base https://shivampahuja.github.io/nitya-weds-anuj
```

The RSVP form posts `name, attending, guests, events, note, submittedAt` as a form-encoded POST to the endpoint set at build time.
