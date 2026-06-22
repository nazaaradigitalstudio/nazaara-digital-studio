// Static, fixed grain overlay. Lives on its own GPU layer (pointer-events-none,
// fixed) so it never triggers repaints on scrolling containers.
export default function Grain() {
  return <div className="grain" aria-hidden />;
}
