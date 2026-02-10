import type { ReactNode } from "react";

type WorkflowNodeProps = {
  index: string;
  title: string;
  description: string;
  accentClass: string;
  iconClass: string;
  badge?: string;
  footer: ReactNode;
};

export default function WorkflowNode({
  index,
  title,
  description,
  accentClass,
  iconClass,
  badge,
  footer,
}: WorkflowNodeProps) {
  return (
    <article className="node-care reveal-up workflow-node z-10 w-full max-w-[320px]" data-interactive="true">
      <div className="mb-10 flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-current/10 text-lg font-bold ${accentClass}`}
        >
          {index}
        </div>
        {badge ? (
          <span className={`text-[9px] font-bold uppercase tracking-[0.25em] ${accentClass}`}>
            {badge}
          </span>
        ) : (
          <span className={`inline-flex h-2 w-2 rounded-full ${iconClass} animate-pulse`} />
        )}
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mb-8 text-xs leading-relaxed text-muted-foreground">{description}</p>
      {footer}
    </article>
  );
}
