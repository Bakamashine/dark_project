import { OverlayTrigger, Popover } from "react-bootstrap";

const CSS_CLASSES: { name: string; description: string }[] = [
  { name: ".page", description: "document page (sheet) with shadow" },
  { name: ".border", description: "page frame" },
  { name: ".title-one", description: "centered bold heading" },
  { name: ".stamp", description: "bottom title block" },
  { name: ".left", description: "left block of the stamp" },
  { name: ".left-top", description: "top row of the left block" },
  { name: ".left-bottom", description: "bottom rows of the left block" },
  { name: ".center", description: "middle part of the stamp" },
  { name: ".right", description: "right block" },
  { name: ".right-top", description: "top cell of the right block" },
  { name: ".right-bottom", description: "bottom cell (page number)" },
  {
    name: ".img-one",
    description: "image 500×500px (img defaults to 200×200px)",
  },
];

export default function CssClassesTip() {
  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement="bottom-start"
      overlay={
        <Popover id="css-classes-tip" className="css-classes-tip">
          <Popover.Header as="h3">CSS classes for pages</Popover.Header>
          <Popover.Body>
            <ul className="css-classes-tip__list">
              {CSS_CLASSES.map((c) => (
                <li key={c.name}>
                  <code>{c.name}</code>
                  <span className="css-classes-tip__desc">
                    {" "}
                    — {c.description}
                  </span>
                </li>
              ))}
            </ul>
          </Popover.Body>
        </Popover>
      }
    >
      <button className="btn btn-outline-secondary" type="button">
        CSS classes
      </button>
    </OverlayTrigger>
  );
}