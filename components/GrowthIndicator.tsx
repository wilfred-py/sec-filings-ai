// components/GrowthIndicator.tsx
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

interface GrowthIndicatorProps {
value: number | null;
unit?: string;
}

const GrowthIndicator = ({ value, unit = '' }: GrowthIndicatorProps) => {
if (!value) return null;
const isPositive = !String(value).includes('-');
const numericValue = String(value).replace(/[-+]/g, '').trim();

return (
<span className={`inline-flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
    {isPositive ? <FaCaretUp className="mr-1" /> : <FaCaretDown className="mr-1" />}
    {numericValue}{unit}
</span>
);
};

export default GrowthIndicator;