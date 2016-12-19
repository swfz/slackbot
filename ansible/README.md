# ansible setup

## dependencies role install

```
ansible-galaxy install -p ./roles -r requirements.yml
```

## slack token to 'token.yml'

- token.yml

```
botkit_token=xxxxxxxxx
```

## setup

```
ansible-playbook -i hosts bot.yml --extra-vars="@token.yml"
```
