import Label from '../Label';
import InfoButton from './InfoButton';

export default function TextField({
  label,
  name,
  title,
  value,
  onChange,
  info,
  required,
  disabled,
  ...props
}) {
  return (
    <Label>
      {label}
      <input
        name={name}
        type="text"
        title={title}
        required={required}
        disabled={disabled}
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
