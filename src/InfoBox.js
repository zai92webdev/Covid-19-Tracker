import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react';
import './InfoBox.css'
import numeral from 'numeral'

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <div>
            <Card
                className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
                onClick={props.onClick} >
                <CardContent>
                    <Typography className="infoBox__title">
                        {title}
                    </Typography>
                    <h2 className="infoBox__cases">{numeral(cases).format('0,0')}</h2>
                    <Typography className="infoBox__total">{numeral(total).format('0,0')} Total</Typography>
                </CardContent>
            </Card>
        </div>
    )
}


export default InfoBox
