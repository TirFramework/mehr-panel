import React from "react";
import useIndexPage from "../hooks/useIndexPage";
import IndexShell from "../blocks/IndexShell";
import IndexBody from "../blocks/IndexBody";
import NotFoundPage from "./NotFoundPage";

/**
 * Default index page: useIndexPage + IndexShell + IndexBody (table / override).
 *
 * To use cards (or any custom rows UI), drop:
 *   dynamic-slots/IndexBody.jsx
 * See IndexBody.jsx.sample for a cards example.
 */
function Index() {
  const index = useIndexPage();

  if (index.notFound) {
    return <NotFoundPage />;
  }

  return (
    <IndexShell index={index}>
      <IndexBody index={index} />
    </IndexShell>
  );
}

export default Index;
