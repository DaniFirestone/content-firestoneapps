import { type LucideIcon } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { BackButton } from './BackButton';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  icon?: LucideIcon | React.ComponentType<any>;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbSegment[];
  sticky?: boolean;
  back?: boolean | string; // true for default "Back", string for custom label like "Incubator"
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  breadcrumbs,
  sticky = false,
  back = false
}: PageHeaderProps) {
  const header = (
    <div className="mb-6 space-y-3">
      {/* Back Button */}
      {back && (
        <BackButton label={typeof back === 'string' ? back : undefined} />
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-1">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">{title}</h1>
            {subtitle && <p className="mt-1 text-lg text-foreground/80">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );

  if (sticky) {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-4">
        {header}
      </div>
    );
  }

  return header;
}
