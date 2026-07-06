import { redirect } from "next/navigation";

// This page has been renamed to /sermons. Kept as a redirect so any
// existing bookmarks or external links to /live keep working.
export default function Live() {
  redirect("/sermons");
}
