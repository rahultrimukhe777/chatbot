console.clear();
const messages = [
    { author: 'loading', body: '...', timeout: 0 },
    { author: 'bot', body: 'Hello', timeout: 200 },
    { author: 'bot', body: 'Follow the white rabbit...', timeout: 400 },
    { author: 'bot', body: 'Ach i\'m kidding, it\'s me, Paul', timeout: 3000 },
    { author: 'bot', body: 'What\'s up?', timeout: 4000 },
    { author: 'bot', body: [
            { url: '/blog/', text: 'Blog' },
            { url: 'https://codepen.io/onefastsnail', text: 'Codepen' },
            { url: 'https://github.com/onefastsnail', text: 'Github' }
        ], timeout: 5000
    }
];

const responses = [
    'This bot silly',
    'No really, its a gimic, quickly made in my Codepen',
    [ 'Ok here is a joke...', 'When Alexander Graham Bell invented the telephone he had three missed calls from Chuck Norris'],
    ['Want another? Ok last one...', 'Chuck Norris can win a game of Connect 4 with 3 moves' ],
    'I\'m out, good bye.'
];

const Message = props => {
    const { id, author, body } = props.data;
    let finalBody;
    if (Array.isArray(body)) {
        finalBody = body.map((item, index) => {
            return <a href={item.url} className="c-chat__action" key={index}>{item.text}</a>;
        });
    }
    else {
        finalBody = <div className="c-chat__message">{body}</div>;
    }

    return (
        <li className={"c-chat__item c-chat__item--" + author}>
            {finalBody}
        </li>
    );
};

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            responses: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.demo = this.demo.bind(this);
        this.mockReply = this.mockReply.bind(this);
    }

    componentDidMount() {
        this.demo();
    }

    demo() {

        this.setState({
            messages: [],
            responses: 0
        });

        messages.map((item, index) => {
            setTimeout(() => this.addMessage(item), item.timeout);
        });
        
        // window.addEventListener('keydown', (e) => {
        //     // if d for demo
        //     if (e.keyCode == "68") {
        //         this.demo();
        //     }
        // });
        
        setTimeout(() => {
            this.setState({
                messages: this.state.messages.slice(1, this.state.messages.length)
            });
        }, 700);

    }

    addMessage(item) {
        this.setState({
            messages: [...this.state.messages, item]
        });

        setTimeout(() => {
            const items = document.querySelectorAll('li');
            const lastItem = items[items.length - 1];
            document.querySelector('.c-chat__list').scrollTop = lastItem.offsetTop + lastItem.style.height;
        }, 100);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        this.addMessage({
            author: 'human',
            body: e.target.querySelector('input').value
        });

        this.mockReply();

        e.target.reset();

    }

    mockReply() {
        let response;

        if (this.state.responses == 0) {
            response = responses[this.state.responses];
        }
        else {
            if(responses[this.state.responses]) response = responses[this.state.responses];
        }

        if(response){
            this.setState({
                responses: this.state.responses + 1
            });

            if(Array.isArray(response)){
                response.map((item, index) => {
                    setTimeout(() => this.addMessage({ author: 'bot', body: item }), 600 + (500 * index));
                });
            }
            else {
                setTimeout(() => this.addMessage({ author: 'bot', body: response }), 600);
            }
        }
    }

    render() {

        let cssClass = ['c-chat'];

        if(this.state.messages.length > 4){
            cssClass.push('c-chat--ready');
        }

        if(this.state.messages.length == 5){
            document.querySelector('input').focus();
        }

        return (
            <div className={cssClass.join(' ')}>
                <ul className="c-chat__list">
                    {this.state.messages.map((message, index) => <Message key={index} data={message} />)}
                </ul>
                <form className="c-chat__form" onSubmit={this.handleSubmit}>
                    <input type="text" name="input" placeholder="Type your message here..." autoFocus autoComplete="off" required />
                </form>
            </div>
        );
    }
}

ReactDOM.render(<Chat />, document.getElementById('chat'));