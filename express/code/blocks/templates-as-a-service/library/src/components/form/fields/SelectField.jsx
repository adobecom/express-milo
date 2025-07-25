import Label from '../Label';
import InfoButton from './InfoButton';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  info,
  ...props
}) {
  return (
    <Label>
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {info && (
        <InfoButton 
          fieldName={name} 
          content={info}
        />
      )}
    </Label>
  );
}