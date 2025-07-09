import Label from '../Label';
import InfoButton from './InfoButton';

export default function NumberField({
  label,
  name,
  value,
  onChange,
  info,
  ...props
}) {
  return (
    <Label>
      {label}
      <input
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        {...props}
      />
      {info && (
        <InfoButton 
          fieldName={name} 
          content={info}
        />
      )}
    </Label>
  );
}