type Props = {
  filename: string;
  status?: string;
  action?: React.ReactNode;
};

/** The macOS-style title bar that frames every screen as an open terminal window. */
export default function TerminalTitleBar({ filename, status, action }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-hairline bg-panel px-5 py-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex shrink-0 items-center gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red" />
          <span className="h-3 w-3 rounded-full bg-yellow" />
          <span className="h-3 w-3 rounded-full bg-green" />
        </span>
        <span className="truncate text-sm text-text-dim">{filename}</span>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {status && <span className="hidden text-sm font-semibold text-amber sm:inline">{status}</span>}
        {action}
      </div>
    </header>
  );
}
