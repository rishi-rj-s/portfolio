import { greenPowerIndiaCaseStudy } from './green-power-india';
import { tagticsCaseStudy } from './tagtics';
import { CaseStudy } from './types';

const caseStudies: CaseStudy[] = [tagticsCaseStudy, greenPowerIndiaCaseStudy];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
