use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.counter_account.init = true;
        ctx.accounts.counter_account.auth = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn increment(ctx: Context<CounterAction>) -> Result<()> {
        ctx.accounts.counter_account.counter += 1;

        Ok(())
    }

    pub fn decrement(ctx: Context<CounterAction>) -> Result<()> {
        ctx.accounts.counter_account.counter -= 1;

        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct CounterAccount {
    pub init: bool,
    pub counter: u64,
    pub auth: Pubkey,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 8 + 1 + 32,
        seeds = [user.key().as_ref(), b"counter".as_ref()], 
        bump
    )]
    pub counter_account: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CounterAction<'info> {
    #[account(
        mut,
        constraint = counter_account.auth == user.key()
    )]
    pub counter_account: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}
