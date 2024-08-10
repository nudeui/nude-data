# Nude Data `<nude-data>` (WIP)

A standalone web component for displaying and editing JS/JSON data.

- ✅ Supports two displays: one for non-technical humans, and one that displays data as code (`type="code"`).
- ✅ Load data from a file, specify as element contents, or just assign to the `data` property.
- ✅ Allows optionally making certain nodes selectable (`selectable` attribute).

This is a work in progress. Things to do:
- [ ] Finish code display mode, which is currently a bit of a mess.
- [ ] Add support for editing data.
- [ ] Make it reactive.

**Warning**: Do not use this to render untrusted data without overridding `NudeData.parse()`.
By default it will `eval()` the data if it can’t parse it as JSON.