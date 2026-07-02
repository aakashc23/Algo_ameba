import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex items-center gap-0',
      className,
    )}
    {...props}
  />
);

const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      // underline style — matches the app's tab aesthetic
      'relative inline-flex items-center justify-center whitespace-nowrap',
      'px-3 py-2.5',
      'font-mono text-[12.5px] font-semibold',
      'text-muted-foreground',
      'border-b-2 border-transparent',
      'transition-colors duration-200 ease-in-out',
      'cursor-pointer select-none outline-none',
      'data-[state=active]:text-brand data-[state=active]:border-brand',
      'hover:text-foreground',
      className,
    )}
    {...props}
  />
);

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    className={cn('flex-1 min-h-0 flex flex-col outline-none', className)}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
