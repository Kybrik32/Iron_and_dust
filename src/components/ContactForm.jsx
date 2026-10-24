import { useEffect, useRef, useState } from 'react';
import { projectTypes, validateProject } from '../validateProject.js';

const initial = { name: '', email: '', motorcycle: '', projectType: '', message: '' };
const fieldOrder = ['name', 'email', 'motorcycle', 'projectType', 'message'];

export default function ContactForm({ request }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const refs = useRef({});

  useEffect(() => {
    if (request?.projectType) {
      setValues(previous => ({ ...previous, projectType: request.projectType }));
      setErrors(previous => ({ ...previous, projectType: undefined }));
      setChecked(false);
    }
  }, [request]);

  const change = (key, value) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setChecked(false);
    if (attempted) setErrors(previous => ({ ...previous, [key]: validateProject(next)[key] }));
  };
  const submit = event => {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validateProject(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { refs.current[fieldOrder.find(key => nextErrors[key])]?.focus(); setChecked(false); }
    else setChecked(true);
  };
  const errorProps = key => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `${key}-error` : undefined });
  const error = key => errors[key] && <span className="field-error" id={`${key}-error`}>{errors[key]}</span>;

  return <section className="section contact" id="contact" aria-labelledby="contact-title"><div className="shell contact-grid">
    <div className="contact-intro"><p className="eyebrow"><span className="eyebrow-line" />Get in Touch / 05</p><h2 id="contact-title" tabIndex="-1">Your next ride<br /><em>starts here.</em></h2><p>Tell us what you have in mind and explore the demo form below.</p><div className="contact-aside"><span>01 / Your idea</span><span>02 / Your direction</span><span>03 / Your next ride</span></div></div>
    <div className="form-panel"><p className="demo-notice"><span aria-hidden="true">●</span> Portfolio demo only. Your details are not sent or saved.</p><form noValidate onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Name <span>*</span></label><input id="name" name="name" autoComplete="name" value={values.name} maxLength="100" required ref={el => refs.current.name = el} onChange={e => change('name', e.target.value)} placeholder="Your name" {...errorProps('name')} />{error('name')}</div>
        <div className="field"><label htmlFor="email">Email <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" value={values.email} maxLength="254" required ref={el => refs.current.email = el} onChange={e => change('email', e.target.value)} placeholder="you@example.com" {...errorProps('email')} />{error('email')}</div>
        <div className="field"><label htmlFor="motorcycle">Motorcycle / Model</label><input id="motorcycle" name="motorcycle" value={values.motorcycle} maxLength="120" ref={el => refs.current.motorcycle = el} onChange={e => change('motorcycle', e.target.value)} placeholder="What are you riding?" {...errorProps('motorcycle')} />{error('motorcycle')}</div>
        <div className="field"><label htmlFor="projectType">Project Type <span>*</span></label><select id="projectType" name="projectType" value={values.projectType} required ref={el => refs.current.projectType = el} onChange={e => change('projectType', e.target.value)} {...errorProps('projectType')}><option value="">Select project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select>{error('projectType')}</div>
        <div className="field field-wide"><label htmlFor="message">Tell Us About Your Project <span>*</span></label><textarea id="message" name="message" rows="6" value={values.message} maxLength="3000" required ref={el => refs.current.message = el} onChange={e => change('message', e.target.value)} placeholder="What would you like to create?" {...errorProps('message')} />{error('message')}</div>
      </div>
      <div className="form-bottom"><button className="button" type="submit">Check Project Details <span aria-hidden="true">↗</span></button><span>* Required fields</span></div>
      <p className="form-status" role="status">{checked ? 'Your project details look complete. This is a portfolio demo — nothing has been sent or saved.' : ''}</p>
    </form></div>
  </div></section>;
}
