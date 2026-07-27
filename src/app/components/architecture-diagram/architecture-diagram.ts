import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { ArchitectureEdge, ArchitectureNode } from '../../data/case-studies/types';

@Component({
  selector: 'app-architecture-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="architecture-diagram rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]/30 p-4 md:p-6 overflow-x-auto">
      <p class="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">{{ summary() }}</p>

      <div class="flex flex-col gap-6 min-w-[280px]">
        @for (group of groups(); track group.name) {
          <div>
            @if (group.name) {
              <div class="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-60 mb-3">
                {{ group.name }}
              </div>
            }
            <div class="flex flex-wrap gap-3">
              @for (node of group.nodes; track node.id) {
                <div class="px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-background)] text-sm font-medium text-[var(--color-text)]">
                  {{ node.label }}
                </div>
              }
            </div>
          </div>
        }
      </div>

      <ul class="mt-8 space-y-2 border-t border-[var(--color-border)] pt-6">
        @for (edge of edges(); track edge.from + edge.to + (edge.label || '')) {
          <li class="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs md:text-sm font-mono text-[var(--color-text-secondary)]">
            <span class="text-[var(--color-text)]">{{ labelFor(edge.from) }}</span>
            <span class="opacity-40" aria-hidden="true">→</span>
            <span class="text-[var(--color-text)]">{{ labelFor(edge.to) }}</span>
            @if (edge.label) {
              <span class="opacity-60">· {{ edge.label }}</span>
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class ArchitectureDiagram {
  readonly summary = input.required<string>();
  readonly nodes = input.required<ArchitectureNode[]>();
  readonly edges = input.required<ArchitectureEdge[]>();

  readonly groups = computed(() => {
    const map = new Map<string, ArchitectureNode[]>();
    for (const node of this.nodes()) {
      const key = node.group ?? '';
      const list = map.get(key) ?? [];
      list.push(node);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([name, nodes]) => ({ name, nodes }));
  });

  labelFor(id: string): string {
    return this.nodes().find((n) => n.id === id)?.label ?? id;
  }
}
