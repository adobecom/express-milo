import Label from '../Label';
import InfoButton from './InfoButton';

export default function TextArea({
  label,
  name,
  value,
  onChange,
  info,
}) {
  return (
    <Label>
      <small>{label}</small>
      <textarea
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        name={name}
        value={value}
        onChange={onChange}
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
