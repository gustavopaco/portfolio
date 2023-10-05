export const ProjectStatusToRibbonClass: Record<string, string> = {
  IN_PROGRESS: 'in-progress',
  UNDER_REVIEW: 'under-review',
  LAUNCHED: 'launched',
  EMERGENCY: 'emergency',
  MAINTENANCE: 'maintenance',
  FUTURE: 'future',
  PAUSED: 'paused',
  HIGHLIGHT: 'highlight',
  OLD: 'old'
}

export const getRibbonClass = (projectStatus: string): string => {
  for (const status in ProjectStatusToRibbonClass) {
    if (Object.hasOwn(ProjectStatusToRibbonClass, status) && status === projectStatus) {
      return ProjectStatusToRibbonClass[status];
    }
  }
  return '';
}
