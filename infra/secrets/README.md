Store encrypted secrets here.

Example:

```bash
age-keygen -o .agekey
export SOPS_AGE_KEY_FILE=.agekey
sops --encrypt --in-place infra/secrets/staging.enc.yaml
```
