import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

interface BackButtonProps {
  label?: string;
  to?: string;
}

export function BackButton({ label = 'Back', to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} className="gap-2 mb-2">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
